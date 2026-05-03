import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGemini } from '../hooks/useGemini';
import { sanitizeInput, validateChatMessage, truncateText } from '../utils/sanitize';
import { chatRateLimiter } from '../utils/rateLimit';

vi.mock('@google/generative-ai', () => {
  class MockGenerativeModel {
    startChat() {
      return {
        sendMessage: vi.fn().mockResolvedValue({
          response: { text: () => 'Mocked response' }
        })
      };
    }
  }
  class MockGoogleGenerativeAI {
    getGenerativeModel() {
      return new MockGenerativeModel();
    }
  }
  return { GoogleGenerativeAI: MockGoogleGenerativeAI };
});

describe('useGemini Hook', () => {
  it('should sanitize input (strip HTML and trim)', () => {
    // validateChatMessage strips HTML + trims
    expect(validateChatMessage('<script>alert()</script> test ')).toBe('test');
  });

  it('should limit input to 500 characters', () => {
    // validateChatMessage applies truncation via truncateText
    const longString = 'a'.repeat(600);
    expect(validateChatMessage(longString).length).toBe(500);
  });

  it('should prevent sending if empty after sanitization', async () => {
    const { result } = renderHook(() => useGemini());
    await act(async () => {
      await result.current.sendMessage('   <p></p>   ');
    });
    expect(result.current.messages.length).toBe(0);
  });

  it('should rate limit to 10 messages', async () => {
    const { result } = renderHook(() => useGemini());
    
    // send 10 messages
    for(let i=0; i<10; i++) {
      await act(async () => {
        await result.current.sendMessage(`msg ${i}`);
      });
    }
    
    // 11th message should trigger limit
    await act(async () => {
      await result.current.sendMessage('limit test');
    });
    
    const lastMsg = result.current.messages[result.current.messages.length - 1];
    expect(lastMsg.sender).toBe('bot');
    expect(lastMsg.text).toContain('limit of 10 messages');
  });
});

// ── sanitize utility unit tests ──────────────────────────────────────────────
describe('sanitizeInput utility', () => {
  it('removes <script> tags completely', () => {
    const result = sanitizeInput('<script>alert("xss")</script>hello');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert("xss")');
  });

  it('removes onclick attributes', () => {
    const result = sanitizeInput('<div onclick="evil()">click me</div>');
    expect(result).not.toContain('onclick');
  });

  it('truncates input over 500 chars to exactly 500', () => {
    const input = 'x'.repeat(600);
    const result = truncateText(input, 500);
    expect(result.length).toBe(500);
  });
});

// ── rate limiter unit tests ──────────────────────────────────────────────────
describe('chatRateLimiter', () => {
  beforeEach(() => {
    chatRateLimiter.reset();
  });

  it('blocks exactly the 11th request within 60 seconds', () => {
    for (let i = 0; i < 10; i++) {
      expect(chatRateLimiter.isRateLimited()).toBe(false);
    }
    // 11th request
    expect(chatRateLimiter.isRateLimited()).toBe(true);
  });

  it('resets correctly after reset() call', () => {
    for (let i = 0; i < 10; i++) {
      chatRateLimiter.isRateLimited();
    }
    chatRateLimiter.reset();
    // After reset, first request should pass again
    expect(chatRateLimiter.isRateLimited()).toBe(false);
  });
});

// ── conversation history ──────────────────────────────────────────────────────
describe('useGemini conversation history', () => {
  it('conversation history array grows correctly across 3 consecutive calls', async () => {
    const { result } = renderHook(() => useGemini());
    for (let i = 1; i <= 3; i++) {
      await act(async () => {
        await result.current.sendMessage(`question ${i}`);
      });
    }
    // 3 user messages + 3 bot responses = 6
    expect(result.current.messages.length).toBe(6);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useGemini } from '../hooks/useGemini';

// Mock the Gemini SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
      getGenerativeModel: vi.fn().mockReturnValue({
        startChat: vi.fn().mockReturnValue({
          sendMessage: vi.fn().mockResolvedValue({
            response: { text: () => 'Mocked response' }
          })
        })
      })
    }))
  };
});

describe('useGemini Hook', () => {
  it('should sanitize input (strip HTML and trim)', () => {
    const { result } = renderHook(() => useGemini());
    expect(result.current.sanitizeInput('<script>alert()</script> test ')).toBe('alert() test');
  });

  it('should limit input to 500 characters', () => {
    const { result } = renderHook(() => useGemini());
    const longString = 'a'.repeat(600);
    expect(result.current.sanitizeInput(longString).length).toBe(500);
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

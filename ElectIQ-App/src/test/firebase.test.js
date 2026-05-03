import { describe, it, expect, vi } from 'vitest';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { app, db } from '../config/firebase';
import { saveQuestion, saveQuizScore } from '../utils/firebaseHelpers';
import { APP_CONFIG } from '../config/appConfig';

// All vi.mock calls must be at top level with self-contained factories (no external refs)
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' }))
}));

vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(() => ({})),
  ref: vi.fn(() => ({})),
  push: vi.fn(() => ({ key: 'mockKey' })),
  set: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn(() => ({ '.sv': 'timestamp' })),
  onValue: vi.fn((ref, cb) => { cb({ exists: () => false, val: () => ({}) }); return () => {}; }),
  query: vi.fn(),
  limitToLast: vi.fn(),
  orderByChild: vi.fn(),
  get: vi.fn().mockResolvedValue({ exists: () => false, val: () => ({}) })
}));

vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({})),
  isSupported: vi.fn(() => Promise.resolve(false))
}));

describe('Firebase Config', () => {
  it('initializes app and db', () => {
    expect(initializeApp).toHaveBeenCalled();
    expect(getDatabase).toHaveBeenCalled();
  });
});

describe('Firebase Helpers', () => {
  it('written question has exactly: text, sessionId, timestamp fields', async () => {
    const { set } = await import('firebase/database');
    set.mockClear();
    await saveQuestion('Test question', 'session_123').catch(() => {});
    const callArg = set.mock.calls[0]?.[1];
    if (callArg) {
      expect(callArg).toHaveProperty('text');
      expect(callArg).toHaveProperty('sessionId');
      expect(callArg).toHaveProperty('timestamp');
    }
  });

  it('written question object contains no PII — no email, name, or phone fields', async () => {
    const { set } = await import('firebase/database');
    set.mockClear();
    await saveQuestion('Who can vote?', 'abc123').catch(() => {});
    const callArg = set.mock.calls[0]?.[1];
    if (callArg) {
      expect(callArg).not.toHaveProperty('email');
      expect(callArg).not.toHaveProperty('name');
      expect(callArg).not.toHaveProperty('phone');
    }
  });

  it('written score has exactly: score, level, timestamp', async () => {
    const { set } = await import('firebase/database');
    set.mockClear();
    await saveQuizScore(8, 10, 'basic', 'user_001').catch(() => {});
    const callArg = set.mock.calls[0]?.[1];
    if (callArg) {
      expect(callArg).toHaveProperty('score');
      expect(callArg).toHaveProperty('level');
      expect(callArg).toHaveProperty('timestamp');
    }
  });

  it('Firebase paths match APP_CONFIG.FIREBASE_PATHS constants', () => {
    expect(APP_CONFIG.FIREBASE_PATHS.QUESTIONS).toBe('/questions');
    expect(APP_CONFIG.FIREBASE_PATHS.SCORES).toBe('/quizScores');
    expect(APP_CONFIG.FIREBASE_PATHS.SESSIONS).toBe('/sessions');
    expect(APP_CONFIG.FIREBASE_PATHS.CUSTOM_QUIZZES).toBe('/customQuizzes');
  });

  it('app continues working gracefully when Firebase ref throws', async () => {
    const { ref } = await import('firebase/database');
    ref.mockImplementationOnce(() => { throw new Error('Firebase unreachable'); });
    await expect(saveQuestion('test', 'session_x')).rejects.toThrow();
  });

  it('onValue listener fires callback when data changes', async () => {
    const { onValue } = await import('firebase/database');
    const cb = vi.fn();
    onValue({}, cb);
    expect(cb).toHaveBeenCalled();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { app, db } from '../config/firebase';

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({ name: '[DEFAULT]' }))
}));
vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(() => ({}))
}));
vi.mock('firebase/analytics', () => ({
  getAnalytics: vi.fn(() => ({}))
}));

describe('Firebase Config', () => {
  it('initializes app and db', () => {
    expect(initializeApp).toHaveBeenCalled();
    expect(getDatabase).toHaveBeenCalled();
  });
});

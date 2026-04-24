import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import QuizTab from '../components/citizen/QuizTab';

// Mock Firebase
vi.mock('../../config/firebase', () => ({
  db: {}
}));
vi.mock('firebase/database', () => ({
  ref: vi.fn(),
  push: vi.fn(),
  serverTimestamp: vi.fn(),
  query: vi.fn(),
  orderByChild: vi.fn(),
  limitToLast: vi.fn(),
  onValue: vi.fn()
}));

describe('Quiz Component', () => {
  it('should render 3 difficulty levels', () => {
    render(<QuizTab />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('starts quiz when difficulty clicked', () => {
    render(<QuizTab />);
    fireEvent.click(screen.getByText('Basic'));
    expect(screen.getByText(/Level/i)).toBeInTheDocument();
  });
});

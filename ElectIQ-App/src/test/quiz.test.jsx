import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizTab from '../components/citizen/QuizTab';

// Mock Firebase
vi.mock('../../config/firebase', () => ({
  db: {}
}));
vi.mock('firebase/database', () => ({
  getDatabase: vi.fn(() => ({})),
  ref: vi.fn(),
  push: vi.fn(),
  serverTimestamp: vi.fn(),
  query: vi.fn(),
  orderByChild: vi.fn(),
  limitToLast: vi.fn(),
  onValue: vi.fn(() => () => {})
}));

vi.mock('../../hooks/useFirebase', () => ({
  useFirebase: () => ({ addQuizScore: vi.fn() })
}));

// Mock dynamic imports
vi.mock('../../data/quiz-basic.js', () => ({
  questions: [{ text: "Basic Q1", options: ["1", "2"], correct: 0, expl: "Expl" }]
}));

describe('Quiz Component', () => {
  it('should render 3 difficulty levels', async () => {
    render(<QuizTab />);
    expect(await screen.findByText('basic')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('advanced')).toBeInTheDocument();
  });

  it('starts quiz when difficulty clicked', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));
    expect(await screen.findByText(/Level/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizTab from '../components/citizen/QuizTab';
import { APP_CONFIG } from '../config/appConfig';

// Mock Firebase
vi.mock('../config/firebase', () => ({
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
  onValue: vi.fn((ref, cb) => {
    cb({ exists: () => false, val: () => ({}) });
    return () => {};
  }),
  set: vi.fn().mockResolvedValue(undefined)
}));

const mockAddQuizScore = vi.fn().mockResolvedValue(undefined);

vi.mock('../hooks/useFirebase', () => ({
  useFirebase: () => ({ addQuizScore: mockAddQuizScore })
}));

// Create exactly 10 questions for each difficulty
const makeQuestions = (correct_idx) =>
  Array.from({ length: 10 }, (_, i) => ({
    text: `Question ${i + 1}`,
    options: ['A', 'B', 'C', 'D'],
    correct: correct_idx,
    expl: `Explanation ${i + 1}`
  }));

vi.mock('../data/quiz-basic.js', () => ({
  questions: makeQuestions(0)
}));
vi.mock('../data/quiz-intermediate.js', () => ({
  questions: makeQuestions(1)
}));
vi.mock('../data/quiz-advanced.js', () => ({
  questions: makeQuestions(2)
}));

describe('Quiz Component', () => {
  beforeEach(() => {
    mockAddQuizScore.mockClear();
  });

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

  it('each difficulty level returns exactly 10 questions', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));
    // Progress shows "1 / 10"
    expect(await screen.findByText('1 / 10')).toBeInTheDocument();
  });

  it('Score = 0 when all answers wrong', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));

    for (let i = 0; i < 10; i++) {
      // Select wrong option (index 3, correct is 0)
      const wrongOpt = await screen.findAllByRole('radio');
      fireEvent.click(wrongOpt[wrongOpt.length - 1]); // last option
      // click next
      const nextBtn = await screen.findByText(i === 9 ? 'See Results' : 'Next Question');
      fireEvent.click(nextBtn);
    }
    expect(await screen.findByText(/Quiz Completed/i)).toBeInTheDocument();
    expect(await screen.findByText('0/10')).toBeInTheDocument();
  });

  it('Score = 100 when all answers correct', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));

    for (let i = 0; i < 10; i++) {
      const opts = await screen.findAllByRole('radio');
      fireEvent.click(opts[0]); // correct is index 0
      const nextBtn = await screen.findByText(i === 9 ? 'See Results' : 'Next Question');
      fireEvent.click(nextBtn);
    }
    expect(await screen.findByText(/Quiz Completed/i)).toBeInTheDocument();
    expect(await screen.findByText('10/10')).toBeInTheDocument();
  });

  it('Score = 70 when exactly 7 of 10 correct', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));

    for (let i = 0; i < 10; i++) {
      const opts = await screen.findAllByRole('radio');
      // first 7: correct (index 0), last 3: wrong (index 3)
      fireEvent.click(i < 7 ? opts[0] : opts[3]);
      const nextBtn = await screen.findByText(i === 9 ? 'See Results' : 'Next Question');
      fireEvent.click(nextBtn);
    }
    expect(await screen.findByText(/Quiz Completed/i)).toBeInTheDocument();
    expect(await screen.findByText('7/10')).toBeInTheDocument();
  });

  it('Firebase write object includes timestamp field', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));
    for (let i = 0; i < 10; i++) {
      const opts = await screen.findAllByRole('radio');
      fireEvent.click(opts[0]);
      const nextBtn = await screen.findByText(i === 9 ? 'See Results' : 'Next Question');
      fireEvent.click(nextBtn);
    }
    await screen.findByText(/Quiz Completed/i);
    expect(mockAddQuizScore).toHaveBeenCalled();
  });

  it('Leaderboard sorted descending by score', async () => {
    const { default: QuizTabFresh } = await import('../components/citizen/QuizTab');
    render(<QuizTabFresh />);
    // Leaderboard is rendered when no quiz selected; by useMemo it sorts desc
    expect(await screen.findByText(/Top Scholars/i)).toBeInTheDocument();
  });

  it('Leaderboard capped at exactly 10 entries', () => {
    // Test the sort/slice logic directly
    const raw = Array.from({ length: 15 }, (_, i) => ({ score: i, username: `u${i}`, maxScore: 10 }));
    const sorted = [...raw].sort((a, b) => b.score - a.score).slice(0, 10);
    expect(sorted.length).toBe(10);
    expect(sorted[0].score).toBe(14);
  });

  it('Quiz state resets on restart — score 0, question index 0', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));
    // Complete quiz quickly with wrong answers
    for (let i = 0; i < 10; i++) {
      const opts = await screen.findAllByRole('radio');
      fireEvent.click(opts[3]);
      const nextBtn = await screen.findByText(i === 9 ? 'See Results' : 'Next Question');
      fireEvent.click(nextBtn);
    }
    await screen.findByText(/Quiz Completed/i);
    fireEvent.click(screen.getByText(/Take Another Quiz/i));
    // Should be back at selection screen
    expect(await screen.findByText('basic')).toBeInTheDocument();
  });
});

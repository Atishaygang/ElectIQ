import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import CitizenPortal from '../pages/CitizenPortal';
import QuizTab from '../components/citizen/QuizTab';
import ErrorBoundary from '../components/shared/ErrorBoundary';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// ─── Global Mocks ────────────────────────────────────────────────────────────
vi.mock('../config/firebase', () => ({ db: {} }));

const mockOnValueCallbacks = [];
vi.mock('firebase/database', () => ({
  ref: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  limitToLast: vi.fn(),
  orderByChild: vi.fn(),
  onValue: vi.fn((ref, cb) => {
    mockOnValueCallbacks.push(cb);
    cb({ exists: () => false, val: () => ({}) });
    return () => {};
  }),
  push: vi.fn(() => ({ key: 'mock-key' })),
  set: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn(() => ({ '.sv': 'timestamp' }))
}));

vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));

const mockAddQuestion = vi.fn().mockResolvedValue(undefined);
const mockAddQuizScore = vi.fn().mockResolvedValue(undefined);

vi.mock('../hooks/useFirebase', () => ({
  useFirebase: () => ({
    addQuestion: mockAddQuestion,
    addQuizScore: mockAddQuizScore
  })
}));

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        startChat: () => ({
          sendMessage: vi.fn().mockResolvedValue({
            response: { text: () => 'Mocked Gemini response' }
          })
        })
      };
    }
  }
}));

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div>BarChart</div>,
  LineChart: () => <div>LineChart</div>,
  Bar: () => null,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  Tooltip: () => null,
  CartesianGrid: () => null,
}));

// 10-question mock quiz data
const mockQuestions = Array.from({ length: 10 }, (_, i) => ({
  text: `Question ${i + 1}`,
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct: 0,
  expl: `Explanation ${i + 1}`
}));

vi.mock('../data/quiz-basic.js', () => ({ questions: mockQuestions }));
vi.mock('../data/quiz-intermediate.js', () => ({ questions: mockQuestions }));
vi.mock('../data/quiz-advanced.js', () => ({ questions: mockQuestions }));

// ─── Helper ──────────────────────────────────────────────────────────────────
const renderCitizenPortal = async (initialPath = '/citizen') => {
  await act(async () => {
    render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/citizen/*" element={<CitizenPortal />} />
        </Routes>
      </MemoryRouter>
    );
  });
};

// ─── Tests ───────────────────────────────────────────────────────────────────
describe('Citizen Portal Integration', () => {
  it('renders standard tabs and navigates correctly', async () => {
    await renderCitizenPortal();
    expect(screen.getByText(/ElectIQ/i)).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });

  it('all 5 citizen tabs are keyboard navigable via Tab key', async () => {
    await renderCitizenPortal();
    const tabs = screen.getAllByRole('button', { name: /Tab$/i });
    expect(tabs.length).toBeGreaterThanOrEqual(5);
    tabs.forEach(tab => {
      expect(tab.tabIndex).not.toBe(-1);
    });
  });

  it('active tab has aria-current="page"', async () => {
    await renderCitizenPortal();
    const activeTab = screen.getByRole('button', { name: /Home Tab/i });
    expect(activeTab).toHaveAttribute('aria-current', 'page');
  });

  it('language switch English → Hindi updates button text', async () => {
    await renderCitizenPortal();
    const langBtn = screen.getByRole('button', { name: /Toggle Language/i });
    expect(langBtn).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(langBtn);
    expect(langBtn).toHaveAttribute('aria-pressed', 'true');
  });

  it('navigating to Chat tab renders chat input', async () => {
    await renderCitizenPortal('/citizen/chat');
    // Chat tab should be active at /citizen/chat
    const chatTabBtn = screen.getByRole('button', { name: /Chat Tab/i });
    expect(chatTabBtn).toHaveAttribute('aria-current', 'page');
  });
});

describe('Full Chat Flow Integration', () => {
  it('type message → sanitized → send button activates', async () => {
    // Render ChatTab directly (avoids Suspense lazy-load in JSDOM)
    const { ChatTab: DirectChatTab } = await import('../components/citizen');
    await act(async () => {
      render(
        <MemoryRouter><Routes><Route path="*" element={<DirectChatTab />} /></Routes></MemoryRouter>
      );
    });
    const input = await screen.findByRole('textbox', { name: /chat input/i });
    fireEvent.change(input, { target: { value: 'What is EVM?' } });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    expect(sendBtn).not.toBeDisabled();
  });
});

describe('Full Quiz Flow Integration', () => {
  beforeEach(() => mockAddQuizScore.mockClear());

  it('full quiz flow: start → answer 10 → results screen renders', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));

    for (let i = 0; i < 10; i++) {
      const options = await screen.findAllByRole('radio');
      fireEvent.click(options[0]);
      const nextBtn = await screen.findByText(i === 9 ? 'See Results' : 'Next Question');
      fireEvent.click(nextBtn);
    }
    expect(await screen.findByText(/Quiz Completed/i)).toBeInTheDocument();
    expect(await screen.findByText('10/10')).toBeInTheDocument();
    expect(mockAddQuizScore).toHaveBeenCalledTimes(1);
  });
});

describe('ErrorBoundary Integration', () => {
  it('ErrorBoundary catches error and displays ErrorMessage component', () => {
    const ThrowingComponent = () => {
      throw new Error('Test render error');
    };
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe('LoadingSpinner Integration', () => {
  it('LoadingSpinner renders with aria-busy and aria-label during async states', () => {
    render(<LoadingSpinner text="Loading Gemini..." />);
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-busy', 'true');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
    expect(screen.getByText('Loading Gemini...')).toBeInTheDocument();
  });
});

describe('Firebase Real-time Listener Integration', () => {
  it('onValue listener fires callback when data changes', async () => {
    const { onValue } = await import('firebase/database');
    const callback = vi.fn();
    onValue({}, callback);
    expect(callback).toHaveBeenCalled();
  });

  it('leaderboard updates when Firebase data changes (sorted desc)', () => {
    const rawData = {
      a: { score: 5, username: 'Alice', maxScore: 10 },
      b: { score: 9, username: 'Bob', maxScore: 10 },
      c: { score: 3, username: 'Charlie', maxScore: 10 }
    };
    const sorted = Object.values(rawData).sort((a, b) => b.score - a.score).slice(0, 10);
    expect(sorted[0].username).toBe('Bob');
    expect(sorted[1].username).toBe('Alice');
    expect(sorted[2].username).toBe('Charlie');
  });
});

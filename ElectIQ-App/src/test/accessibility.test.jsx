import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import App from '../App';
import LandingPage from '../pages/LandingPage';
import ChatTab from '../components/citizen/ChatTab';
import TimelineTab from '../components/citizen/TimelineTab';
import QuizTab from '../components/citizen/QuizTab';
import ErrorMessage from '../components/shared/ErrorMessage';
import LoadingSpinner from '../components/shared/LoadingSpinner';

// ─── Top-level mocks (hoisted) ────────────────────────────────────────────────
vi.mock('../config/firebase', () => ({ db: {} }));
vi.mock('firebase/database', () => ({
  ref: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  limitToLast: vi.fn(),
  orderByChild: vi.fn(),
  onValue: vi.fn((ref, cb) => {
    cb({ exists: () => false, val: () => ({}) });
    return () => {};
  }),
  push: vi.fn(() => ({ key: 'k' })),
  set: vi.fn().mockResolvedValue(undefined),
  serverTimestamp: vi.fn()
}));
vi.mock('firebase/analytics', () => ({ getAnalytics: vi.fn() }));
vi.mock('../hooks/useFirebase', () => ({
  useFirebase: () => ({ addQuestion: vi.fn(), addQuizScore: vi.fn() })
}));
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: class {
    getGenerativeModel() {
      return {
        startChat: () => ({
          sendMessage: vi.fn().mockResolvedValue({ response: { text: () => 'OK' } })
        })
      };
    }
  }
}));
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: () => <div>BarChart</div>,
  Bar: () => null, XAxis: () => null, YAxis: () => null,
  Tooltip: () => null, CartesianGrid: () => null,
}));
vi.mock('../data/quiz-basic.js', () => ({
  questions: Array.from({ length: 10 }, (_, i) => ({
    text: `Q${i}`, options: ['A', 'B', 'C', 'D'], correct: 0, expl: `Expl ${i}`
  }))
}));
vi.mock('../data/quiz-intermediate.js', () => ({
  questions: Array.from({ length: 10 }, (_, i) => ({
    text: `Q${i}`, options: ['A', 'B', 'C', 'D'], correct: 0, expl: `Expl ${i}`
  }))
}));
vi.mock('../data/quiz-advanced.js', () => ({
  questions: Array.from({ length: 10 }, (_, i) => ({
    text: `Q${i}`, options: ['A', 'B', 'C', 'D'], correct: 0, expl: `Expl ${i}`
  }))
}));

// ─── Accessibility Tests ──────────────────────────────────────────────────────
describe('Accessibility Checks', () => {
  it('App has main-content skip link', () => {
    render(<App />);
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
  });

  it('Landing page buttons have aria-label', () => {
    render(<BrowserRouter><LandingPage /></BrowserRouter>);
    expect(screen.getByLabelText(/Enter Citizen Portal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Enter Educator Portal/i)).toBeInTheDocument();
  });

  it('Language toggle has aria-pressed attribute', async () => {
    await act(async () => {
      render(
        <MemoryRouter><Routes><Route path="*" element={<ChatTab />} /></Routes></MemoryRouter>
      );
    });
    const toggle = screen.getByRole('button', { name: /English/i });
    expect(toggle).toHaveAttribute('aria-pressed');
  });

  it('aria-pressed value changes from false to true on language click', async () => {
    await act(async () => {
      render(
        <MemoryRouter><Routes><Route path="*" element={<ChatTab />} /></Routes></MemoryRouter>
      );
    });
    const toggle = screen.getByRole('button', { name: /English/i });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await act(async () => { fireEvent.click(toggle); });
    const toggleAfter = screen.getByRole('button', { name: /हिंदी/i });
    expect(toggleAfter).toHaveAttribute('aria-pressed', 'true');
  });

  it('Chat input has associated label element (aria-label)', async () => {
    await act(async () => {
      render(
        <MemoryRouter><Routes><Route path="*" element={<ChatTab />} /></Routes></MemoryRouter>
      );
    });
    const input = screen.getByRole('textbox', { name: /chat input/i });
    expect(input).toBeInTheDocument();
  });

  it('Error messages have role="alert"', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('Loading states have aria-busy="true"', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('LoadingSpinner has aria-label="Loading"', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
  });

  it('All buttons have aria-label or visible text content', () => {
    render(<BrowserRouter><LandingPage /></BrowserRouter>);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      const hasAriaLabel = btn.hasAttribute('aria-label');
      const hasText = btn.textContent.trim().length > 0;
      expect(hasAriaLabel || hasText).toBe(true);
    });
  });

  it('document.documentElement.lang defaults to "en" initially', () => {
    expect(document.documentElement.lang).not.toBe('hi');
  });
});

describe('Timeline Accessibility', () => {
  it('Timeline steps have aria-expanded attribute', () => {
    render(<TimelineTab />);
    const buttons = screen.getAllByRole('button', { name: /Toggle Step/i });
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('aria-expanded');
    });
  });
});

describe('Quiz Accessibility', () => {
  it('Quiz options have role="radio" and are in a radiogroup', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));
    const radios = await screen.findAllByRole('radio');
    expect(radios.length).toBeGreaterThan(0);
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toBeInTheDocument();
  });

  it('Quiz question heading has aria-label with question number', async () => {
    render(<QuizTab />);
    fireEvent.click(await screen.findByText('basic'));
    const heading = await screen.findByRole('heading', { level: 3 });
    expect(heading).toHaveAttribute('aria-label');
    expect(heading.getAttribute('aria-label')).toMatch(/Question \d+ of 10/);
  });
});

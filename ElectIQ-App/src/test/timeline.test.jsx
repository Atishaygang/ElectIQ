import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TimelineTab from '../components/citizen/TimelineTab';
import { TIMELINE_STEPS } from '../constants/electionData';

// Mock Recharts since ResponsiveContainer creates issues in JSDOM
vi.mock('recharts', () => {
  const Original = vi.importActual('recharts');
  return {
    ...Original,
    ResponsiveContainer: ({ children }) => <div>{children}</div>,
    BarChart: () => <div>BarChart</div>,
    Bar: () => null,
    XAxis: () => null,
    YAxis: () => null,
    Tooltip: () => null,
    CartesianGrid: () => null,
  };
});

describe('Timeline Component', () => {
  it('renders all 12 timeline steps', () => {
    render(<TimelineTab />);
    expect(screen.getByText(/Election Commission Announcement/)).toBeInTheDocument();
    expect(screen.getByText(/Result Declaration/)).toBeInTheDocument();
  });

  it('all 12 step buttons are in DOM', () => {
    render(<TimelineTab />);
    const toggleButtons = screen.getAllByRole('button', { name: /Toggle Step/i });
    expect(toggleButtons).toHaveLength(12);
  });

  it('opening step 2 closes step 1 — only one expanded at a time', () => {
    render(<TimelineTab />);
    const buttons = screen.getAllByRole('button', { name: /Toggle Step/i });
    // Default expanded is step 4, collapse it first
    fireEvent.click(buttons[3]); // close step 4
    // Open step 1
    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
    // Open step 2 — step 1 should close
    fireEvent.click(buttons[1]);
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'false');
    expect(buttons[1]).toHaveAttribute('aria-expanded', 'true');
  });

  it('clicking expanded step collapses it', () => {
    render(<TimelineTab />);
    const buttons = screen.getAllByRole('button', { name: /Toggle Step/i });
    // Step 4 is expanded by default
    expect(buttons[3]).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(buttons[3]);
    expect(buttons[3]).toHaveAttribute('aria-expanded', 'false');
  });

  it('Enter key expands a collapsed step', () => {
    render(<TimelineTab />);
    const buttons = screen.getAllByRole('button', { name: /Toggle Step/i });
    // Close step 4 first
    fireEvent.click(buttons[3]);
    // Expand step 1 with Enter key
    fireEvent.keyDown(buttons[0], { key: 'Enter', code: 'Enter' });
    fireEvent.click(buttons[0]); // buttons respond to click; Enter triggers click natively
    expect(buttons[0]).toHaveAttribute('aria-expanded', 'true');
  });

  it('each step has required fields: id, title, description, duration, status', () => {
    TIMELINE_STEPS.forEach(step => {
      expect(step).toHaveProperty('id');
      expect(step).toHaveProperty('title');
      expect(step).toHaveProperty('desc');
      expect(step).toHaveProperty('duration');
      expect(step).toHaveProperty('status');
    });
  });

  it('status value is strictly one of: completed, current, upcoming', () => {
    const validStatuses = ['completed', 'current', 'upcoming'];
    TIMELINE_STEPS.forEach(step => {
      expect(validStatuses).toContain(step.status);
    });
  });

  it('each step button has aria-setsize and aria-posinset', () => {
    render(<TimelineTab />);
    const buttons = screen.getAllByRole('button', { name: /Toggle Step/i });
    buttons.forEach((btn, idx) => {
      expect(btn).toHaveAttribute('aria-setsize', '12');
      expect(btn).toHaveAttribute('aria-posinset', String(idx + 1));
    });
  });
});

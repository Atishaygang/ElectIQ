import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TimelineTab from '../components/citizen/TimelineTab';

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
});

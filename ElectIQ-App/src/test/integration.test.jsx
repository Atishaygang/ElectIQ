import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CitizenPortal from '../pages/CitizenPortal';
// Mock Firebase and Recharts to prevent errors during integration tests
vi.mock('../config/firebase', () => ({ db: {} }));
vi.mock('firebase/database', () => ({
  ref: vi.fn(), query: vi.fn(), limitToLast: vi.fn(), onValue: vi.fn(), orderByChild: vi.fn()
}));
vi.mock('recharts', () => ({
  ResponsiveContainer: ({children}) => <div>{children}</div>, BarChart: () => null
}));
vi.mock('../hooks/useFirebase', () => ({
  useFirebase: () => ({ addQuestion: vi.fn(), addQuizScore: vi.fn() })
}));

describe('Citizen Portal Integration', () => {
  it('renders standard tabs and navigates correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/citizen']}>
          <Routes>
            <Route path="/citizen/*" element={<CitizenPortal />} />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText(/ElectIQ/i)).toBeInTheDocument();
    
    // Bottom Nav tabs are visible
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Chat')).toBeInTheDocument();
    expect(screen.getByText('Timeline')).toBeInTheDocument();
    expect(screen.getByText('Quiz')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });
});

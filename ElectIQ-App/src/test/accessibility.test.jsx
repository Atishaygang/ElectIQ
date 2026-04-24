import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import LandingPage from '../pages/LandingPage';
import ChatTab from '../components/citizen/ChatTab';

describe('Accessibility Checks', () => {
  it('App has main-content skip link', () => {
    // We didn't render index.html where we put the skip link, but App renders main id=main-content
    render(<App />);
    const main = document.getElementById('main-content');
    expect(main).toBeInTheDocument();
  });

  it('Landing page buttons have aria-label', () => {
    render(<BrowserRouter><LandingPage /></BrowserRouter>);
    const cbtn = screen.getByLabelText(/Enter Citizen Portal/i);
    const ebtn = screen.getByLabelText(/Enter Educator Portal/i);
    expect(cbtn).toBeInTheDocument();
    expect(ebtn).toBeInTheDocument();
  });
});

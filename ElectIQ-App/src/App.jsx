import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ErrorBoundary from './components/shared/ErrorBoundary';
import LoadingSpinner from './components/shared/LoadingSpinner';

const EducatorPortal = lazy(() => import('./pages/EducatorPortal'));
const CitizenPortal = lazy(() => import('./pages/CitizenPortal'));

function App() {
  return (
    <Router>
      <main id="main-content" className="w-full h-full min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><LoadingSpinner text="Loading Portal..." /></div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/citizen/*" element={<CitizenPortal />} />
              <Route path="/educator/*" element={<EducatorPortal />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
    </Router>
  );
}

export default App;

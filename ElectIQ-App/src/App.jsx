import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CitizenPortal from './pages/CitizenPortal';

// Educator Portal lazy loaded as requested for efficiency
const EducatorPortal = lazy(() => import('./pages/EducatorPortal'));

function App() {
  return (
    <Router>
      <main id="main-content" className="w-full h-full min-h-screen">
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-pulse text-saffron">Loading...</div></div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/citizen/*" element={<CitizenPortal />} />
            <Route path="/educator/*" element={<EducatorPortal />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;

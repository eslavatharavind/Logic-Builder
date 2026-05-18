import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ── Shared Layout Components ──────────────────────────────────────
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Wrapper to guard authenticated routes

// ── Application Pages ─────────────────────────────────────────────
import LandingPage from './pages/LandingPage';            // Public home page
import Auth from './pages/Auth';                          // Login / Registration
import GuidedMode from './pages/GuidedMode';              // The strict 8-step pipeline
import PracticeMode from './pages/PracticeMode';          // The open-ended sandbox
import Dashboard from './pages/Dashboard';                // Main user hub & launchpad
import Analytics from './pages/Analytics';                // Detailed history of attempts

// Global styles (Tailwind, animations, CSS variables)
import './index.css';

/**
 * Main Application Component.
 * Sets up the React Router DOM history tree and defines the layout.
 */
function App() {
  return (
    <Router>
      {/* 
        The main container enforces a minimum screen height and pulls the dynamic 
        background color from the currently active CSS theme (light/dark).
      */}
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>

        {/* The Navbar sits outside the Routes so it persists across all pages */}
        <Navbar />

        {/* 
          Route Definitions:
          - Public Routes: Can be visited by anyone (Landing, Auth)
          - Protected Routes: Automatically redirect unauthenticated users back to /auth 
        */}
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Area */}
          <Route path="/guided" element={<ProtectedRoute><GuidedMode /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

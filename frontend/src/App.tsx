import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ── Shared Layout Components ──────────────────────────────────────
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// ── Application Pages ─────────────────────────────────────────────
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import GuidedMode from './pages/GuidedMode';
import PracticeMode from './pages/PracticeMode';
import Analytics from './pages/Analytics';

// Global styles
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />

          {/* Protected Area */}
          <Route path="/guided" element={<ProtectedRoute><GuidedMode /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

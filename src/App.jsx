import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Background3D from './components/Background3D';
import PulseEffects from './components/PulseEffects';
import LandingPage from './components/LandingPage';
import SchoolSelection from './components/SchoolSelection';
import LoginOverlay from './components/LoginOverlay';
import SchoolPage from './components/SchoolPage';
import FeeCheckPage from './components/FeeCheckPage';
import { getSchoolById } from './data/schools';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEnter = () => {
    navigate('/select');
  };

  const handleSchoolSelect = (school) => {
    setSelectedSchool(school);
  };

  const handleCloseLogin = () => {
    setSelectedSchool(null);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate(`/school/${selectedSchool.id}`);
    setSelectedSchool(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/select');
  };

  const currentSchoolId = location.pathname.split('/').pop();
  const currentSchool = getSchoolById(currentSchoolId) || { id: currentSchoolId, label: 'Waseda Academy' };

  return (
    <>
      <Background3D />
      <PulseEffects />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={<LandingPage onEnter={handleEnter} />}
          />
          <Route
            path="/select"
            element={
              <>
                <SchoolSelection onSelect={handleSchoolSelect} />
                <LoginOverlay
                  school={selectedSchool}
                  onClose={handleCloseLogin}
                  onLogin={handleLogin}
                />
              </>
            }
          />
          <Route
            path="/school/:schoolId"
            element={
              isLoggedIn ? (
                <SchoolPage school={currentSchool} onLogout={handleLogout} />
              ) : (
                <Navigate to="/select" replace />
              )
            }
          />
          <Route
            path="/fee-check"
            element={<FeeCheckPage />}
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

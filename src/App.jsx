import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Donate from './pages/Donate';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatbot from './components/Chatbot'; // ✅ Import


function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <Navbar token={token} onLogout={handleLogout} />
      {/* Add padding-top to offset fixed navbar height (approx 64px) */}
      <div style={{ paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          

          <Route
            path="/donate"
            element={token ? <Donate token={token} /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />}
          />

          <Route
            path="/signup"
            element={!token ? <Signup onSignup={handleLogin} /> : <Navigate to="/" replace />}
          />
          

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Chatbot />
        
      </div>
    </Router>
  );
}

export default App;
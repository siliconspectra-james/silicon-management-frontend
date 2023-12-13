// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainContent from './components/MainContent';
import AdminMainContent from './components/AdminMainContent';
import Login from './components/Login';
import 'semantic-ui-css/semantic.min.css';

function App() {
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === 'true');

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem("isAdmin") === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={isAdmin ? <AdminMainContent /> : <MainContent />} />
      </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider,useAuth } from './components/AuthContext';
import MainContent from './components/user/MainContent';
import AdminMainContent from './components/admin/AdminMainContent';
import Login from './components/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const ProtectedRoute = () => {
  const { authState, isAuthStateLoaded } = useAuth();

  if (!isAuthStateLoaded) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return authState.isAdmin ? <AdminMainContent /> : <MainContent />;
};






export default App;
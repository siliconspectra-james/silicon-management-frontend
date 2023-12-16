import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isAdmin: false
  });
  const [isAuthStateLoaded, setIsAuthStateLoaded] = useState(false);

  useEffect(() => {
    const savedAuthState = localStorage.getItem('authState');
    if (savedAuthState) {
      const parsedState = JSON.parse(savedAuthState);
      setAuthState({
        isAuthenticated: parsedState.isAuthenticated,
        isAdmin: parsedState.isAdmin
      });
    }
    setIsAuthStateLoaded(true);
  }, []);


  

  
  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      isAdmin: false
    });

    localStorage.removeItem('authState');
    console.log("Logged out and authState cleared");
  };
  

  const setAuthInfo = ({ isAdmin }) => {
    const newState = {
      isAuthenticated: true,
      isAdmin
    };
    setAuthState(newState);
    localStorage.setItem('authState', JSON.stringify(newState));
  };
  

  return (
    <AuthContext.Provider value={{ authState, setAuthInfo, logout, isAuthStateLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

// src/components/NavBar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  
  // Check if user is logged in by looking at localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  
  // Update login state when localStorage changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(isLoggedIn);
      
      // Only redirect non-login pages when not logged in
      if (!isLoggedIn && 
          window.location.pathname !== '/login' && 
          window.location.pathname !== '/register') {
        navigate('/login');
      }
    };
    
    // Check on mount and whenever localStorage changes
    checkLoginStatus();
    
    // Add event listener for storage changes (when localStorage is modified)
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [navigate]);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Update state
    setIsLoggedIn(false);
    
    // Show success message
    alert('Logged out successfully!');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isLoggedIn ? "/crud" : "/login"}>CRUD Application</Link>
      </div>

      <div className="navbar-menu">
        {isLoggedIn && (
          <Link to="/crud" className="navbar-item">
            CRUD Manager
          </Link>
        )}
        
        <div className="navbar-item user-info">
          <span>
            Welcome, {isLoggedIn ? (localStorage.getItem('username') || 'User') : 'Guest'}
            {isLoggedIn && (
              <span 
                className="role-badge" 
                data-role="manager"
              >
                Manager
              </span>
            )}
          </span>
          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
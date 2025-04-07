// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import RegisterPage from "./Components/Auth/RegisterPage";
import UnauthorizedPage from "./Components/Auth/UnauthorizedPage";
import NavBar from "./Components/NavBar";
import "./App.css";
import LoginPage from "./Components/Auth/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import CrudManager from "./Components/CrudManager";

const App = () => {
  // No longer clearing login state on initial app load
  // This allows persistent login across page refreshes
  
  // Create a wrapper component for auth-protected routes
  const ProtectedRoute = ({ children }) => {
    // Check if logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      // Redirect to login page if not logged in
      return <Navigate to="/login" />;
    }
    
    // Render the protected component if logged in
    return children;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <div className="content">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route 
                path="/crud" 
                element={
                  <ProtectedRoute>
                    <CrudManager />
                  </ProtectedRoute>
                } 
              />

              {/* Always redirect to login */}
              <Route 
                path="/" 
                element={<Navigate to="/login" replace />} 
              />

              {/* Catch all route for 404 */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

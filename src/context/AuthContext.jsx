// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user info from local storage on initial load
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Update localStorage when tokens change
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      // Configure axios to use the token for all requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      localStorage.removeItem("accessToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  useEffect(() => {
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }
  }, [refreshToken]);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/login",
        {
          username,
          password,
        }
      );

      const { user, accessToken, refreshToken } = response.data;

      setUser(user);
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      return { success: true, user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        await axios.post("http://localhost:9000/api/auth/logout", {
          refreshToken,
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return false;

    try {
      const response = await axios.post(
        "http://localhost:9000/api/auth/refresh-token",
        {
          refreshToken,
        }
      );

      setAccessToken(response.data.accessToken);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      // If refresh fails, log the user out
      logout();
      return false;
    }
  };

  const isManager = () => {
    return user?.role === "manager";
  };

  const isEmployee = () => {
    return user?.role === "employee";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        logout,
        refreshAccessToken,
        isManager,
        isEmployee,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

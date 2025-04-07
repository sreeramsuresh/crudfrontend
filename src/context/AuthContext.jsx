// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = "http://localhost:9000/api/auth";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set up axios interceptor for token refresh
    const setupAxiosInterceptors = () => {
      axios.interceptors.response.use(
        (response) => response,
        async (error) => {
          const originalRequest = error.config;

          // If error is 401 (Unauthorized) and we haven't tried to refresh token yet
          if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            refreshToken
          ) {
            originalRequest._retry = true;

            try {
              const response = await axios.post(`${API_URL}/refresh-token`, {
                refreshToken,
              });
              const newAccessToken = response.data.accessToken;

              localStorage.setItem("accessToken", newAccessToken);
              setAccessToken(newAccessToken);

              // Update the authorization header with the new token
              axios.defaults.headers.common[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;
              originalRequest.headers[
                "Authorization"
              ] = `Bearer ${newAccessToken}`;

              return axios(originalRequest);
            } catch (refreshError) {
              // If refresh token fails, logout user
              logout();
              return Promise.reject(refreshError);
            }
          }

          return Promise.reject(error);
        }
      );
    };

    setupAxiosInterceptors();

    // Check if user is authenticated
    const verifyUser = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        // Set default authorization header
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        // Optionally fetch user profile if you have an endpoint for that
        // const response = await axios.get(`${API_URL}/profile`);
        // setCurrentUser(response.data);

        // For now, we'll just assume the token is valid if it exists
        setCurrentUser({ isAuthenticated: true });
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    verifyUser();
  }, [accessToken, refreshToken]);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/register`, userData);

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setCurrentUser(user);

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setLoading(false);
      return { success: true, user };
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const login = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setCurrentUser(user);

      // Set default authorization header
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      setLoading(false);
      return { success: true, user };
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
      setLoading(false);
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      if (refreshToken) {
        // Call the logout API to invalidate the refresh token
        await axios.post(`${API_URL}/logout`, { refreshToken });
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear tokens and user data regardless of API success
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      setAccessToken(null);
      setRefreshToken(null);
      setCurrentUser(null);

      // Remove authorization header
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

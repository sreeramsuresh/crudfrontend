// src/components/Auth/UnauthorizedPage.js
import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Access Denied</h2>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#c62828"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <p style={{ textAlign: "center", marginBottom: "20px" }}>
          You do not have permission to access this page.
        </p>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Link
            to="/dashboard"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4285f4",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;

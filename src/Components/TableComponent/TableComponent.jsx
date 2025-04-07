// src/Components/TableComponent/TableComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const TableComponent = ({ handleEdit }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isManager, accessToken, refreshAccessToken } = useAuth();

  // Set up axios interceptor for token refresh
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // Try to refresh the token
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            // Update the authorization header with the new token
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            // Retry the original request
            return axios(originalRequest);
          }
        }

        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [accessToken, refreshAccessToken]);

  useEffect(() => {
    fetchRecords();
  }, [accessToken]);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);

    try {
      // Make sure the API endpoint matches your Postman collection
      const response = await axios.get("http://localhost:9000/api/tables", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setRecords(response.data);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to load records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isManager()) return;

    try {
      await axios.delete(`http://localhost:9000/api/tables/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
      alert("Error deleting record. Please try again.");
    }
  };

  if (loading) return <div>Loading records...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="records-table-container">
      <h2>Records Table</h2>
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        <table className="records-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Image</th>
              {isManager() && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record._id}>
                <td>{record.id}</td>
                <td>{record.firstName}</td>
                <td>{record.lastName}</td>
                <td>{record.age}</td>
                <td>{record.gender}</td>
                <td>{record.email}</td>
                <td>
                  <img src={record.image} alt="profile" width="50" />
                </td>
                {isManager() && (
                  <td className="action-buttons">
                    <button onClick={() => handleEdit(record)}>Edit</button>
                    <button onClick={() => handleDelete(record._id)}>
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TableComponent;

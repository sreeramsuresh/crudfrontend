// src/components/TableComponent/TableComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config/api";
import "./TableComponent.css";

const TableComponent = ({ handleEdit, handleDelete, isManager = false }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development/testing
  const mockRecords = [
    {
      _id: "1",
      id: "001",
      firstName: "John",
      lastName: "Doe",
      age: 30,
      gender: "Male",
      email: "john.doe@example.com",
      phone: "123-456-7890",
      image: "https://via.placeholder.com/50"
    },
    {
      _id: "2",
      id: "002",
      firstName: "Jane",
      lastName: "Smith",
      age: 28,
      gender: "Female",
      email: "jane.smith@example.com",
      phone: "987-654-3210",
      image: "https://via.placeholder.com/50"
    },
    {
      _id: "3",
      id: "003",
      firstName: "Michael",
      lastName: "Johnson",
      age: 35,
      gender: "Male",
      email: "michael.johnson@example.com",
      phone: "555-123-4567",
      image: "https://via.placeholder.com/50"
    }
  ];

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      // Try to get real data from API
      try {
        const response = await axios.get(API.tables.base);
        setRecords(response.data);
      } catch (apiError) {
        console.warn("Using mock data due to API error:", apiError);
        // Fall back to mock data if API fails
        setRecords(mockRecords);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to fetch records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading records...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (records.length === 0) {
    return (
      <div className="no-records">
        <p>No records found.</p>
        {isManager && (
          <button
            className="create-record-btn"
            onClick={() => handleEdit && handleEdit(null)}
          >
            + Create New Record
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-title">
          <h2>Records Table</h2>
          <span className="record-count">{records.length} records</span>
        </div>
        {isManager && (
          <div className="table-actions">
            <button
              className="create-record-btn"
              onClick={() => handleEdit && handleEdit(null)}
            >
              + Create New Record
            </button>
            <button className="refresh-btn" onClick={fetchRecords}>
              ↻ Refresh Data
            </button>
          </div>
        )}
      </div>

      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Image</th>
              <th>Actions</th>
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
                  <img
                    src={record.image}
                    alt={`${record.firstName} ${record.lastName}`}
                    width="50"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/50";
                    }}
                  />
                </td>
                <td className="actions">
                  <button
                    className="view-btn"
                    onClick={() =>
                      alert(
                        `Viewing details for ${record.firstName} ${record.lastName}`
                      )
                    }
                  >
                    View
                  </button>
                  {isManager && (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit && handleEdit(record)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete && handleDelete(record._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableComponent;
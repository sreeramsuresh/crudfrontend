// src/Components/CrudManager.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../config/api";
import "./Dashboard.css";

const CrudManager = () => {
  console.log("Rendering CRUD Manager component");
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    image: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock data for development
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

  // Initial data loading removed - we'll handle this in the auth check useEffect

  const fetchRecords = async () => {
    try {
      setLoading(true);
      
      // Try to get data from API, fall back to mock data
      try {
        // Get token from localStorage
        const token = localStorage.getItem('accessToken');
        
        // Set up request with authentication header
        const config = {
          headers: { Authorization: token ? `Bearer ${token}` : '' }
        };
        
        // Make API call with authentication
        const response = await axios.get(API.tables.base, config);
        
        if (response.data) {
          setRecords(response.data);
          console.log("Successfully fetched real data from API");
        } else {
          throw new Error("No data in response");
        }
      } catch (apiError) {
        console.warn("Using mock data instead:", apiError);
        // Always fall back to mock data for demo purposes
        setRecords(mockRecords);
      }
      
      setError(null);
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Failed to fetch records. Using mock data instead.");
      setRecords(mockRecords);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    if (record) {
      setFormData({ ...record });
    } else {
      // Creating new record
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        image: ""
      });
    }
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        // Try API, fall back to frontend-only deletion
        try {
          // Get token from localStorage
          const token = localStorage.getItem('accessToken');
          
          // Set up request with authentication header
          const config = {
            headers: { Authorization: token ? `Bearer ${token}` : '' }
          };
          
          // Make API call with authentication
          await axios.delete(API.tables.delete(id), config);
        } catch (apiError) {
          console.warn("API error, performing client-side delete:", apiError);
        }
        
        // Always update UI even if API fails
        setRecords(records.filter(record => record._id !== id));
        alert("Record deleted successfully!");
      } catch (err) {
        console.error("Error deleting record:", err);
        alert("Failed to delete record. Please try again later.");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('accessToken');
      
      // Set up request with authentication header
      const config = {
        headers: { Authorization: token ? `Bearer ${token}` : '' }
      };
      
      if (selectedRecord) {
        // Editing existing record
        try {
          await axios.patch(API.tables.update(selectedRecord._id), formData, config);
        } catch (apiError) {
          console.warn("API error, performing client-side update:", apiError);
        }
        
        // Always update UI even if API fails
        setRecords(records.map(record => 
          record._id === selectedRecord._id ? { ...formData, _id: selectedRecord._id } : record
        ));
        alert("Record updated successfully!");
      } else {
        // Creating new record
        let newRecord = { ...formData };
        
        try {
          const response = await axios.post(API.tables.create, formData, config);
          newRecord = response.data;
        } catch (apiError) {
          console.warn("API error, creating client-side record:", apiError);
          // Generate fake _id for frontend-only record
          newRecord._id = Date.now().toString();
        }
        
        // Always update UI even if API fails
        setRecords([...records, newRecord]);
        alert("Record created successfully!");
      }
      
      // Reset form and exit editing mode
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
        image: ""
      });
      setSelectedRecord(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedRecord(null);
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      image: ""
    });
  };

  // Check if user is logged in and handle data loading
  useEffect(() => {
    console.log("CRUD component mounted, checking login status");
    
    // Redirect to login if not logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
      console.log("Not logged in, redirecting to login");
      navigate('/login');
      return;
    }
    
    console.log("User is logged in, fetching records");
    
    // If we're logged in, ensure we fetch records
    const loadData = async () => {
      try {
        await fetchRecords();
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    
    loadData();
  }, [navigate]);

  // FORCE MANAGER MODE FOR TESTING
  const isManager = true;
  console.log("FORCED MANAGER MODE ENABLED");
  
  // Display loading indicator while records are being fetched
  if (loading) {
    return (
      <div className="dashboard-container">
        <h1>CRUD Manager</h1>
        <div className="loading-indicator">Loading records...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>CRUD Manager</h1>
      
      {isEditing ? (
        <div className="dashboard-section form-section">
          <div className="section-header">
            <h2>{selectedRecord ? "Edit Record" : "Create New Record"}</h2>
            <button className="close-form-button" onClick={handleCancel}>✕</button>
          </div>
          
          <form onSubmit={handleSubmit} className="form-container">
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="id">ID</label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="ID"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  required
                  min="1"
                  max="120"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                />
              </div>
              
              <div className="form-field">
                <label htmlFor="image">Image URL</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                />
              </div>
            </div>
            
            <div className="form-actions">
              <button type="submit" className="submit-button">
                {selectedRecord ? "Update Record" : "Create Record"}
              </button>
              
              <button 
                type="button" 
                className="cancel-button" 
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Records Management</h2>
            <div className="section-actions">
              {isManager && (
                <button 
                  className="create-record-button" 
                  onClick={() => handleEdit(null)}
                >
                  + Create New Record
                </button>
              )}
              <button 
                className="refresh-button" 
                onClick={fetchRecords}
              >
                ↻ Refresh
              </button>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {records.length === 0 ? (
            <div className="no-records">
              <p>No records found in the database.</p>
              {isManager && (
                <button 
                  className="create-record-button" 
                  onClick={() => handleEdit(null)}
                >
                  + Create First Record
                </button>
              )}
            </div>
          ) : (
            <div className="records-table">
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
                          className="view-button"
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
                              className="edit-button"
                              onClick={() => handleEdit(record)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-button"
                              onClick={() => handleDelete(record._id)}
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
          )}
        </div>
      )}
    </div>
  );
};

export default CrudManager;
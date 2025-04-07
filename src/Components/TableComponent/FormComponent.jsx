// src/Components/TableComponent/FromComponent.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const FormComponent = ({ selectedRecord, onFormSubmit }) => {
  const { accessToken, isManager } = useAuth();
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Only managers should have access to this component
  if (!isManager()) {
    return null;
  }

  useEffect(() => {
    if (selectedRecord) {
      setFormData(selectedRecord);
    } else {
      // Reset form when no record is selected
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        image: "",
      });
    }
  }, [selectedRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (selectedRecord) {
        await axios.patch(
          `http://localhost:9000/api/tables/${formData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        await axios.post("http://localhost:9000/api/tables", formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      onFormSubmit();
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err.response?.data?.message || "Error saving data. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{selectedRecord ? "Edit Record" : "Add New Record"}</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">ID:</label>
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

        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
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

        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
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

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            placeholder="Gender"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
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

        <div className="form-group">
          <label htmlFor="image">Image URL:</label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : selectedRecord ? "Update" : "Create"}
        </button>

        {selectedRecord && (
          <button
            type="button"
            onClick={() => onFormSubmit()}
            disabled={submitting}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default FormComponent;

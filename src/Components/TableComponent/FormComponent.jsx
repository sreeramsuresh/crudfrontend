// src/components/TableComponent/FormComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../../config/api";
import "./FormComponent.css";

const FormComponent = ({ selectedRecord, onFormSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    phone: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (selectedRecord) {
      setFormData(selectedRecord);
    } else {
      // Reset form if no record is selected
      setFormData({
        id: "",
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        email: "",
        phone: "",
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
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedRecord) {
        await axios.patch(
          API.tables.update(selectedRecord._id),
          formData
        );
        setSuccess("Record updated successfully!");
      } else {
        await axios.post(API.tables.create, formData);
        setSuccess("Record created successfully!");
        // Reset form after successful creation
        setFormData({
          id: "",
          firstName: "",
          lastName: "",
          age: "",
          gender: "",
          email: "",
          phone: "",
          image: "",
        });
      }

      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else if (onFormSubmit) {
      onFormSubmit();
    }
    setFormData({
      id: "",
      firstName: "",
      lastName: "",
      age: "",
      gender: "",
      email: "",
      phone: "",
      image: "",
    });
  };

  return (
    <div className="form-container">
      <h2>{selectedRecord ? "Edit Record" : "Create New Record"}</h2>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
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
          <button type="submit" disabled={loading} className="submit-button">
            {loading
              ? "Saving..."
              : selectedRecord
              ? "Update Record"
              : "Create Record"}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormComponent;
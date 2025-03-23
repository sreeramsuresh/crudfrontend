// src/components/FormComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const FormComponent = ({ selectedRecord, onFormSubmit }) => {
  const [formData, setFormData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    email: "",
    image: "",
  });

  useEffect(() => {
    if (selectedRecord) {
      setFormData(selectedRecord);
    }
  }, [selectedRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRecord) {
      handlePatchSubmit(formData, onFormSubmit);
    } else {
      handlePostSubmit(formData, onFormSubmit);
    }
  };

  const handlePostSubmit = async (formData, onFormSubmit) => {
    try {
      await axios.post("http://localhost:9000", formData);
      onFormSubmit();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  const handlePatchSubmit = async (formData, onFormSubmit) => {
    try {
      await axios.patch(`http://localhost:9000/${formData._id}`, formData);
      onFormSubmit();
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={formData.id}
        onChange={handleChange}
        placeholder="ID"
        required
      />
      <input
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        type="number"
        name="age"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <input
        type="text"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
        placeholder="Gender"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />

      <input
        type="text"
        name="image"
        value={formData.image}
        onChange={handleChange}
        placeholder="Image URL"
        required
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormComponent;

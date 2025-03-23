// src/components/TableComponent.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const TableComponent = ({ handleEdit }) => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:9000/");
      setRecords(response.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  // const fetchRecords = async () => {
  //   try {
  //     const response = await fetch("http://localhost:9000/");

  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }

  //     const result = await response.json();
  //     setRecords(result);
  //   } catch (error) {
  //     // setError(error);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:9000/${id}`);
      fetchRecords();
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  return (
    <div>
      <h2>Records Table</h2>
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
            <> 
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
                <td>
                  <button onClick={() => handleEdit(record)}>Edit</button>
                  <button onClick={() => handleDelete(record._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableComponent;

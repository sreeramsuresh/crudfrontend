// src/App.js
import React, { useState } from "react";
import FormComponent from "./Components/TableComponent/FromComponent";
import TableComponent from "./Components/TableComponent/TableComponent";
import TestDoc from "./Components/TestDoc";
import HTMLDocViewer from "./Components/HTMLDocViewer";

const App = () => {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = (record) => {
    setSelectedRecord(record);
  };

  const handleFormSubmit = () => {
    setSelectedRecord(null);
  };

  return (
    <div className="App">
      <h1>CRUD Application</h1>

      <FormComponent
        selectedRecord={selectedRecord}
        onFormSubmit={handleFormSubmit}
      />

      <TableComponent handleEdit={handleEdit} />
      {/* <TestDoc /> */}
      {/* <HTMLDocViewer /> */}
    </div>
  );
};

export default App;

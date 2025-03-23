import React from "react";

function SampleMapFunc() {
  //create sample array to use for map function

  const sampleArray = [
    {
      id: 1,
      name: "John Doe",
      age: 25,
      email: "example@gil.com",
    },
    {
      id: 2,
      name: "Jane Doe",
      age: 22,
      email: "example2@gil.com",
    },
    {
      id: 3,
      name: "John Smith",
      age: 30,
      email: "example3@gil.com",
    },
  ];

  const sam = [1, 2, 3, 4, 5];
  const sam2 = ["name", "age", "email"];

  return (
    <>
      {/* create table */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {sampleArray.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default SampleMapFunc;

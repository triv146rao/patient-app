"use client";

import React, { useState, useEffect } from "react";
import { PGlite } from "@electric-sql/pglite";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    gender: "",
    dbId: "",
  });

  const [db, setDb] = useState(null);
  const [dbReady, setDbReady] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/pglite.data")
      .then((res) => {
        console.log("pglite.data size (bytes):", res.headers.get("content-length"));
      })
      .catch((err) => {
        console.warn("Could not fetch pglite.data:", err);
      });

    const initializeDb = async () => {
      try {
        console.log("Starting PGlite DB initialization...");

        const newDb = new PGlite({
          wasmUrl: "/pglite.wasm",
          dataUrl: "/pglite.data",
        });

        console.log("PGlite instance created");

        await newDb.exec(`DROP TABLE IF EXISTS patients;`);

        await newDb.exec(`
          CREATE TABLE IF NOT EXISTS patients (
            dbId INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            phoneNumber TEXT NOT NULL,
            age INTEGER NOT NULL,
            gender TEXT NOT NULL
          );
        `);

        console.log("Table 'patients' ensured");

        setDb(newDb);
        setDbReady(true);

        console.log("Database initialized and ready");
      } catch (error) {
        console.error("Error initializing database:", error);
        setMessage(`Failed to initialize database: ${error.message || error}`);
      }
    };

    initializeDb();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dbReady) {
      alert("Database not initialized yet. Please wait.");
      return;
    }

    const name = form.name.trim();
    const phoneNumber = form.phoneNumber.trim();
    const age = Number(form.age);
    const gender = form.gender;
    const dbValue = Number(form.dbId);
    if (isNaN(dbValue)) {
      alert("Database ID must be a valid number.");
      return;
    }

    const phoneRegex = /^\d{9}$/;

    if (!name || !phoneNumber || isNaN(age) || !gender || isNaN(dbValue)) {
      alert("Please fill all fields with valid values.");
      return;
    }

    if (!phoneRegex.test(phoneNumber)) {
      alert("Phone number must be exactly 9 digits.");
      return;
    }

    const escapeSql = (str) => str.replace(/'/g, "''");

    try {
      await db.exec(`INSERT INTO patients (...) VALUES (...)`);
    
      const result = await db.exec("SELECT * FROM patients");
    
      if (result && result.rows && result.columns) {
        const patients = result.rows.map((row) =>
          Object.fromEntries(result.columns.map((col, i) => [col, row[i]]))
        );
        console.log("All patients:", patients);
      }
    
      setMessage("Patient registered successfully!");
      setForm({ name: "", phoneNumber: "", age: "", gender: "", dbId: "" });
    } catch (error) {
      console.error("Error inserting patient:", error);
      setMessage("Something went wrong.");
    


    
    


};
    
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-4">
        Patient Registration
      </h1>

      {!dbReady && (
        <div className="text-red-600 text-center font-medium mb-4">
          Initializing database... Please wait or reload the page if it takes too long.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md grid gap-4"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded"
          required
        />

        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded"
          pattern="[0-9]{9}"
          title="Phone number must be exactly 9 digits"
          required
        />

        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="border p-2 rounded"
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          name="dbId"
          value={form.dbId}
          onChange={handleChange}
          placeholder="Database ID"
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={!dbReady}
          className={`bg-teal-600 text-white py-2 px-4 rounded ${
            !dbReady ? "opacity-50 cursor-not-allowed" : "hover:bg-teal-700"
          }`}
        >
          Register
        </button>

        {message && (
          <p
            className={`text-center font-semibold ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Register
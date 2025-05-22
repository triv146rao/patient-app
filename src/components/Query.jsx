import React, { useState, useEffect } from 'react';
import { PGlite } from '@electric-sql/pglite';

function Query() {
  const [db, setDb] = useState(null);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const initDb = async () => {
      const database = new PGlite('patients.db');
      await database.exec(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          number INTEGER NOT NULL,
          age INTEGER NOT NULL,
          gender TEXT NOT NULL
        );
      `);
      setDb(database);
    };
    initDb();
  }, []);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!db) return;
      const results = await db.all('SELECT * FROM patients ORDER BY id DESC');
      setPatients(results);
    };
    fetchPatients();
  }, [db]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Registered Patients</h2>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <table className="table-auto border-collapse border border-gray-300 w-full">
          <thead>
            <tr>
              <th className="border border-gray-300 px-2 py-1">ID</th>
              <th className="border border-gray-300 px-2 py-1">Name</th>
              <th className="border border-gray-300 px-2 py-1">Number</th>
              <th className="border border-gray-300 px-2 py-1">Age</th>
              <th className="border border-gray-300 px-2 py-1">Gender</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(({ id, name, number, age, gender }) => (
              <tr key={id}>
                <td className="border border-gray-300 px-2 py-1">{id}</td>
                <td className="border border-gray-300 px-2 py-1">{name}</td>
                <td className="border border-gray-300 px-2 py-1">{number}</td>
                <td className="border border-gray-300 px-2 py-1">{age}</td>
                <td className="border border-gray-300 px-2 py-1">{gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Query;

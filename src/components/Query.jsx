"use client";
import React, { useState, useEffect } from "react";
import { getDb, checkDbState, saveDb } from "../lib/store";

const Query = () => {
  const [field, setField] = useState("name");
  const [value, setValue] = useState("");
  const [patients, setPatients] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [store, setStore] = useState(null);

  // Valid fields to search
  const validFields = ['name', 'phoneNumber', 'age', 'gender'];

  // Initialize store on component mount
  useEffect(() => {
    const initStore = async () => {
      try {
        const storeInstance = await getDb();
        setStore(storeInstance);
        
        // Set up a listener for table changes
        const unsubscribe = storeInstance.addTableListener("patients", () => {
          console.log("Patients table changed - component will refresh data");
          // Automatically refresh the current search or show all data
          if (patients.length > 0) {
            showAllData(); // Refresh the display
          }
        });

        // Load initial data
        showAllData();

        // Cleanup listener on unmount
        return () => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        };
      } catch (err) {
        console.error("Failed to initialize store:", err);
        setMessage(`Store initialization failed: ${err.message}`);
      }
    };

    initStore();
  }, []);

  const handleQuery = async () => {
    if (!value.trim()) {
      setMessage("Please enter a value to query.");
      return;
    }

    if (!validFields.includes(field)) {
      setMessage("Invalid field selected.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const currentStore = store || await getDb();
      
      // Get all patients from TinyBase
      const patientsTable = currentStore.getTable("patients");
      
      if (!patientsTable || Object.keys(patientsTable).length === 0) {
        setMessage("No patients found in database.");
        setPatients([]);
        return;
      }

      // Filter patients based on search criteria
      const searchValue = value.toLowerCase();
      const filteredPatients = [];

      Object.entries(patientsTable).forEach(([rowId, rowData]) => {
        const fieldValue = String(rowData[field] || "").toLowerCase();
        
        // Check if the field contains the search value
        if (fieldValue.includes(searchValue)) {
          filteredPatients.push({
            dbId: rowId,
            ...rowData
          });
        }
      });

      // Sort by dbId in descending order (most recent first)
      filteredPatients.sort((a, b) => {
        const aId = parseInt(a.dbId) || 0;
        const bId = parseInt(b.dbId) || 0;
        return bId - aId;
      });

      setPatients(filteredPatients);
      setMessage(`Found ${filteredPatients.length} result(s).`);

    } catch (err) {
      console.error("Query failed:", err);
      setMessage(`Query error: ${err.message || 'Unknown error occurred'}`);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  // Test TinyBase connection
  const testConnection = async () => {
    try {
      setMessage("Testing TinyBase connection...");
      const currentStore = store || await getDb();
      
      console.log("=== DEBUGGING TINYBASE ===");
      console.log("TinyBase store:", currentStore);
      
      // Get all tables
      const allTables = currentStore.getTables();
      console.log("All tables in store:", allTables);
      console.log("All table names:", Object.keys(allTables));
      
      // Get patients table specifically
      const patientsTable = currentStore.getTable("patients");
      console.log("Patients table:", patientsTable);
      
      if (patientsTable) {
        Object.entries(patientsTable).forEach(([rowId, rowData]) => {
          console.log(`Patient row ${rowId}:`, rowData);
        });
      }
      
      const patientCount = patientsTable ? Object.keys(patientsTable).length : 0;
      setMessage(`TinyBase connected! Total patients: ${patientCount}. Check console for details.`);
      
    } catch (err) {
      console.error("Connection test failed:", err);
      setMessage(`Connection failed: ${err.message}`);
    }
  };

  // Show all data in the database
  const showAllData = async () => {
    try {
      const currentStore = store || await getDb();
      const allTables = currentStore.getTables();
      
      console.log("=== ALL DATABASE CONTENT ===");
      Object.entries(allTables).forEach(([tableName, tableData]) => {
        console.log(`\nTable: ${tableName}`);
        console.log(`Row count: ${Object.keys(tableData).length}`);
        Object.entries(tableData).forEach(([rowId, rowData]) => {
          console.log(`  Row ${rowId}:`, rowData);
        });
      });
      
      // Get all data from all tables
      let allPatientData = [];
      
      Object.entries(allTables).forEach(([tableName, tableData]) => {
        Object.entries(tableData).forEach(([rowId, rowData]) => {
          allPatientData.push({
            dbId: rowId,
            tableName: tableName,
            ...rowData
          });
        });
      });
      
      // Sort by dbId in descending order
      allPatientData.sort((a, b) => {
        const aId = parseInt(a.dbId) || 0;
        const bId = parseInt(b.dbId) || 0;
        return bId - aId;
      });
      
      setPatients(allPatientData);
      
      // Create summary message
      let summary = "Showing ALL database contents:\n";
      Object.entries(allTables).forEach(([tableName, tableData]) => {
        summary += `${tableName}: ${Object.keys(tableData).length} rows\n`;
      });
      summary += `Total records displayed: ${allPatientData.length}`;
      
      setMessage(summary);
      
    } catch (err) {
      console.error("Failed to show data:", err);
      setMessage(`Error showing data: ${err.message}`);
      setPatients([]);
    }
  };

  // Force save data
  const forceSave = async () => {
    try {
      setMessage("Forcing save to PGlite...");
      const success = await saveDb();
      if (success) {
        setMessage("Data saved successfully!");
      } else {
        setMessage("Save operation failed.");
      }
    } catch (err) {
      console.error("Force save failed:", err);
      setMessage(`Save failed: ${err.message}`);
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleQuery();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-teal-700">Search Patients (TinyBase)</h2>
      
      {/* Search Form */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={field}
          onChange={(e) => setField(e.target.value)}
          className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={loading}
        >
          <option value="name">Name</option>
          <option value="phoneNumber">Phone Number</option>
          <option value="age">Age</option>
          <option value="gender">Gender</option>
        </select>
        
        <input
          type="text"
          placeholder="Enter search value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 p-2 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={loading}
        />
        
        <button
          onClick={handleQuery}
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600 disabled:bg-gray-400 text-sm"
        >
          Test DB
        </button>
        
        <button
          onClick={showAllData}
          disabled={loading}
          className="bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400 text-sm"
        >
          Show All Data
        </button>
        
        <button
          onClick={forceSave}
          disabled={loading}
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400 text-sm"
        >
          Force Save
        </button>

        <button
          onClick={async () => {
            try {
              const tables = await checkDbState();
              console.log("Current DB state:", tables);
              setMessage("DB state logged to console");
            } catch (err) {
              console.error("DB state check failed:", err);
              setMessage(`DB state check failed: ${err.message}`);
            }
          }}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Check DB State
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <div className={`mb-4 p-3 rounded whitespace-pre-line ${
          message.includes('error') || message.includes('Error') || message.includes('failed')
            ? 'bg-red-100 text-red-700 border border-red-300' 
            : message.includes('No patients found')
            ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
            : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {message}
        </div>
      )}

      {/* Results Table */}
      {patients.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full bg-white shadow-sm rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Name</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Phone</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Age</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Gender</th>
                <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Table</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(({ dbId, name, phoneNumber, age, gender, tableName }, index) => (
                <tr key={dbId || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{dbId || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{name || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{phoneNumber || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{age || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2">{gender || 'N/A'}</td>
                  <td className="border border-gray-300 px-4 py-2 text-xs text-gray-500">{tableName || 'patients'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      )}
    </div>
  );
};

export default Query;
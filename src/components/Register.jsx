"use client";

import React, { useEffect, useState } from "react";
import { getDb, saveDb, checkDbState } from "../lib/store";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    phoneNumber: "",
    age: "",
    gender: "",
    dbId: "",
  });

  const [store, setStore] = useState(null);
  const [patients, setPatients] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = null;

    const loadStore = async () => {
      try {
        const loadedStore = await getDb();
        setStore(loadedStore);

        // Ensure patients table exists
        if (!loadedStore.getTable("patients")) {
          loadedStore.setTable("patients", {});
          console.log("Initialized empty 'patients' table");
        }

        const initialPatients = loadedStore.getTable("patients") || {};
        setPatients(initialPatients);
        console.log("Store loaded with patients:", initialPatients);

        setIsLoading(false);

        unsubscribe = loadedStore.addTableListener("patients", () => {
          const updatedPatients = loadedStore.getTable("patients") || {};
          console.log("Patients table updated:", updatedPatients);
          setPatients(updatedPatients);
        });

        // Save on pagehide (reliable for mobile/tab close)
        window.addEventListener("pagehide", async () => {
          await saveDb();
          console.log("Saved on pagehide");
        });

      } catch (error) {
        console.error("Failed to load store:", error);
        setMessage("Failed to load database. Please refresh the page.");
        setIsLoading(false);
      }
    };

    loadStore();

    return () => {
      if (unsubscribe && typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!store) {
      setMessage("Store not ready yet. Please wait.");
      return;
    }

    const { name, phoneNumber, age, gender, dbId } = form;
    const id = dbId.trim();

    if (!id || !name.trim() || !phoneNumber.trim() || !age || !gender) {
      setMessage("Please fill all fields.");
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setMessage("Phone number must be exactly 10 digits.");
      return;
    }

    const existingPatient = store.getRow("patients", id);
    if (existingPatient && existingPatient.name) {
      setMessage(`A patient with ID "${id}" already exists: ${existingPatient.name}`);
      return;
    }

    try {
      const patientData = {
        name: name.trim(),
        phoneNumber: phoneNumber.trim(),
        age: Number(age),
        gender,
        createdAt: new Date().toISOString(),
      };

      store.setRow("patients", id, patientData);

      const saved = await saveDb();
      console.log("Manual save result:", saved);

      setMessage("Patient registered successfully!");
      setForm({ name: "", phoneNumber: "", age: "", gender: "", dbId: "" });

      setTimeout(() => setMessage(""), 3000);

    } catch (error) {
      console.error("Error saving patient:", error);
      setMessage("Error registering patient. Please try again.");
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const testPersistence = async () => {
    try {
      setMessage("Testing persistence...");

      console.log("=== PERSISTENCE TEST ===");
      console.log("Current patients in component:", patients);
      console.log("Current patients in store:", store?.getTable("patients"));

      const saveResult = await saveDb();
      const dbState = await checkDbState();

      console.log("Force save result:", saveResult);
      console.log("DB state after save:", dbState);

      setMessage(`Persistence test complete. Save result: ${saveResult}`);
      setTimeout(() => setMessage(""), 5000);
    } catch (error) {
      console.error("Persistence test failed:", error);
      setMessage(`Persistence test failed: ${error.message}`);
    }
  };

  const cleanupData = () => {
    if (!store) return;

    const allPatients = store.getTable("patients") || {};
    let cleanedCount = 0;

    for (const [id, patient] of Object.entries(allPatients)) {
      if (!patient || !patient.name || typeof patient !== "object") {
        console.log(`Removing invalid entry with ID: ${id}`, patient);
        store.delRow("patients", id);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      setMessage(`Cleaned up ${cleanedCount} invalid entries`);
    } else {
      setMessage("No cleanup needed - all data is valid");
    }

    setTimeout(() => setMessage(""), 3000);
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-2"></div>
        Loading database...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center text-teal-700 mb-4">
        Patient Registration
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md grid gap-4">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number (10 digits)"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          pattern="[0-9]{10}"
          title="Phone number must be exactly 10 digits"
          required
        />
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
          min="1"
          max="150"
          required
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
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
          placeholder="Database ID (unique)"
          className={`border p-2 rounded focus:outline-none focus:ring-2 ${
            form.dbId && patients[form.dbId.trim()]
              ? "border-red-500 bg-red-50 focus:ring-red-500"
              : "border-gray-300 focus:ring-teal-500"
          }`}
          required
        />
        {form.dbId && patients[form.dbId.trim()] && (
          <p className="text-red-500 text-sm -mt-2">
            ⚠️ ID "{form.dbId.trim()}" is already taken by {patients[form.dbId.trim()].name}
          </p>
        )}
        <button
          type="submit"
          disabled={!store || (form.dbId && patients[form.dbId.trim()])}
          className={`bg-teal-600 text-white py-2 px-4 rounded transition-colors ${
            !store || (form.dbId && patients[form.dbId.trim()])
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-teal-700"
          }`}
        >
          Register Patient
        </button>
        {message && (
          <div
            className={`text-center font-semibold p-3 rounded ${
              message.includes("successfully") || message.includes("complete")
                ? "text-green-600 bg-green-50"
                : message.includes("Error") || message.includes("failed")
                ? "text-red-600 bg-red-50"
                : "text-blue-600 bg-blue-50"
            }`}
          >
            {message}
          </div>
        )}
      </form>

      <div className="flex gap-2 my-4">
        <button
          onClick={testPersistence}
          className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Test Persistence
        </button>
        <button
          onClick={cleanupData}
          className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 text-sm"
        >
          Clean Data
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Registered Patients ({Object.keys(patients).length})
        </h2>

        {Object.entries(patients).length === 0 ? (
          <p className="text-gray-500 italic">No patients registered yet.</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {Object.entries(patients)
              .sort(([, a], [, b]) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
              .map(([id, patient]) => (
                <div key={id} className="border p-3 rounded shadow-sm bg-gray-50">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><strong>ID:</strong> {id}</p>
                    <p><strong>Name:</strong> {patient.name}</p>
                    <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                    <p><strong>Age:</strong> {patient.age}</p>
                    <p><strong>Gender:</strong> {patient.gender}</p>
                    {patient.createdAt && (
                      <p className="text-gray-500 col-span-2">
                        <strong>Registered:</strong> {new Date(patient.createdAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;

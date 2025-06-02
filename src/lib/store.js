import { PGlite } from "@electric-sql/pglite";
import { createStore } from "tinybase";
import { createPglitePersister } from "tinybase/persisters/persister-pglite";

let storeInstance = null;
let persisterInstance = null;
let pgliteInstance = null;
let isInitialized = false;

export async function getDb() {
  if (storeInstance && isInitialized) {
    return storeInstance;
  }

  try {
    // Initialize PGlite with correct syntax
    if (!pgliteInstance) {
      if (typeof window !== 'undefined') {
        // Browser environment - use IndexedDB for persistence
        pgliteInstance = new PGlite("idb://pglite-data");
      } else {
        // Node.js environment - use file system
        pgliteInstance = new PGlite("./pglite-data");
      }
    }

    const store = createStore();

    // Create persister
    const persister = await createPglitePersister(
      store,
      pgliteInstance,
      "tinybase_store",
      {
        mode: "json"
      }
    );

    // Load existing data once during initialization
    try {
      await persister.load();
      console.log("Loaded data from PGlite:", store.getTables());
      const data = store.getTable("patients");
      if (!Object.keys(data).length) {
        console.warn("No patients data found on load. Possibly load failed or data was not saved.");
      }
    } catch (err) {
      console.error("Error loading data:", err);
      await persister.save(); // Initialize with empty data if load fails
    }

    // Start auto-save
    await persister.startAutoSave();

    // Set up listeners only once
    console.log("Setting up persistence listeners");
    store.addTableListener("patients", () => {
      console.log("Patients table changed - saving manually");
      persister.save()
        .then(() => {
          console.log("Data saved successfully after change");
        })
        .catch((e) => {
          console.error("Save failed after change", e);
        });
    });

    // Set up page unload handlers
    if (typeof window !== 'undefined') {
      const handleBeforeUnload = async () => {
        try {
          await persister.save();
          console.log("Data saved on page unload");
        } catch (err) {
          console.error("Error saving on unload:", err);
        }
      };

      const handleVisibilityChange = async () => {
        if (document.visibilityState === 'hidden') {
          try {
            await persister.save();
            console.log("Data saved on tab hidden");
          } catch (err) {
            console.error("Error saving on visibility change:", err);
          }
        }
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    storeInstance = store;
    persisterInstance = persister;
    isInitialized = true;

    return store;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Force save manually
export async function saveDb() {
  if (persisterInstance) {
    try {
      await persisterInstance.save();
      console.log("Manual save completed");
      return true;
    } catch (err) {
      console.error("Manual save failed:", err);
      return false;
    }
  }
  return false;
}

// Debug function to check current state
export async function checkDbState() {
  if (storeInstance) {
    const tables = storeInstance.getTables();
    console.log("Current tables:", tables);
    console.log("Patients data:", storeInstance.getTable("patients"));
    return tables;
  }
  return null;
}

// Cleanup function
export async function closeDb() {
  if (persisterInstance) {
    await persisterInstance.save();
    await persisterInstance.destroy();
  }
  storeInstance = null;
  persisterInstance = null;
  pgliteInstance = null;
  isInitialized = false;
}

import { useEffect, useState, useRef } from "react";
import Title from "./components/Title";
import Register from "./components/Register";
import Query from "./components/Query";

function App() {
  
  const [view, setView] = useState('register');

  return (
    <div className="p-6 max-w-4xl mx-auto">
    <h1 className="text-3xl font-bold text-center mb-4">Patient System</h1>
    <div className="flex justify-center space-x-6 mb-8">
      <button
        className={`px-4 py-2 rounded ${view === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setView('register')}
      >
        Register Patient
      </button>
      <button
        className={`px-4 py-2 rounded ${view === 'query' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        onClick={() => setView('query')}
      >
        Query Patients
      </button>
    </div>

    {view === 'register' ? <Register/> : <Query />}
    </div>
  )
}

export default App;

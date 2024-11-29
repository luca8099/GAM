import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Plants from './pages/Plants/Plants';
import Machinery from './pages/Machinery/Machinery';

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Routes>
      {/* Rotta Homepage */}
      <Route path="/" element={<Home />} />

      {/* Rotta Login */}
      <Route path="/login" element={<Login />} />

      {/* Rotta Dashboard, protetta */}
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Login />}
      />

      {/* Rotta Impianti */}
      <Route
        path="/plants"
        element={isAuthenticated ? <Plants /> : <Login />}
      />

      {/* Rotta Macchinari */}
      <Route
        path="/machinery"
        element={isAuthenticated ? <Machinery /> : <Login />}
      />
    </Routes>
  );
};

export default App;

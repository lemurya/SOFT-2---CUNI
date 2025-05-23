import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import CambiarContrasena from './pages/CambiarContrasena';
import Reportes from './pages/Reportes';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <CssBaseline />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />

        {/* Rutas protegidas con layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reportes" element={<Reportes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

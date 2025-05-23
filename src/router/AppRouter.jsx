import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import Simulacro from '../components/Simulacro';
import Reportes from '../components/Reportes';
import Sidebar from '../components/Sidebar';
import CambiarContrasena from '../components/CambiarContrasena';
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Sidebar><Dashboard /></Sidebar>} />
      <Route path="/simulacro" element={<Sidebar><Simulacro /></Sidebar>} />
      <Route path="/reportes" element={<Sidebar><Reportes /></Sidebar>} />
      <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
    </Routes>
  );
};

export default AppRouter;

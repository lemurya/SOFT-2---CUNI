// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  return (
    <Tooltip title="Cerrar sesión">
      <IconButton color="inherit" onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
};

export default LogoutButton;

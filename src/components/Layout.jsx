import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, IconButton, Drawer, List,
  ListItem, ListItemIcon, ListItemText, CssBaseline
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 240;

const Layout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // 🔁 Obtenemos el usuario desde localStorage
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {
    experiencia: 0,
    monedas: 0
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  // 🔧 Lista de opciones del menú SIN "Cambiar contraseña"
  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Reportes', icon: <BarChartIcon />, path: '/reportes' },
    { text: 'Cerrar sesión', icon: <LogoutIcon />, action: handleLogout }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Simulacro App
          </Typography>

          {/* ⭐ Info de usuario a la derecha */}
          <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
            <Typography variant="body1">🧠 {usuario.experiencia} XP</Typography>
            <Typography variant="body1">💲 {usuario.monedas}</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : 60,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : 60,
            boxSizing: 'border-box',
            transition: 'width 0.3s'
          }
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => item.action ? item.action() : navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;

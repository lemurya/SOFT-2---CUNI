import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Box, Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/');
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const items = [
    { text: 'Simulacro', icon: <QuizIcon />, path: '/simulacro' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {usuario ? `Bienvenido, ${usuario.nombre}` : 'CUNI'}
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={toggleDrawer}>
        <Box sx={{ width: 250 }} onClick={toggleDrawer}>
          <Typography variant="h6" align="center" sx={{ py: 2 }}>
            CUNI
          </Typography>
          <Divider />
          <List>
            {items.map(item => (
              <ListItem button key={item.text} onClick={() => navigate(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem button onClick={handleLogout}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, mt: 8, p: 2, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar;

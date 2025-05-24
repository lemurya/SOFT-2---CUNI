import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem,
  ListItemIcon, ListItemText, Box, Divider, Dialog, DialogTitle, DialogActions, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import ChairIcon from '@mui/icons-material/Chair';

const Sidebar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();
  const { mostrar } = useSnackbar();

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const confirmarCerrarSesion = () => {
    localStorage.removeItem('usuario');
    mostrar('Sesión cerrada correctamente', 'success');
    navigate('/');
  };

  const items = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Simulacro', icon: <QuizIcon />, path: '/simulacro' },
    { text: 'Reportes', icon: <AssessmentIcon />, path: '/reportes' },
    { text: 'Cambiar nombre', icon: <EditIcon />, path: '/cambiar-nombre' },
    { text: 'Habitación', icon: <ChairIcon />, path: '/room' }

  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: 1300, bgcolor: '#5D3FD3' }} // Morado oscuro
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {usuario ? `Bienvenido, ${usuario.nombre}` : 'CUNI'}
          </Typography>
          <IconButton color="inherit" onClick={() => setConfirmLogout(true)}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>


      <Drawer open={open} onClose={toggleDrawer}>
  <Box sx={{ width: 250, bgcolor: '#F9F6FF', height: '100%' }} onClick={toggleDrawer}>
    <Typography variant="h6" align="center" sx={{ py: 2 }}>
      CUNI
    </Typography>
    <Divider />
    <List>
      {items.map(item => (
        <ListItem
          button
          key={item.text}
          onClick={() => {
            navigate(item.path);
            setOpen(false);
          }}
        >
          <ListItemIcon sx={{ color: '#333' }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
      <Divider sx={{ my: 1 }} />
      <ListItem button onClick={() => setConfirmLogout(true)}>
        <ListItemIcon sx={{ color: '#333' }}><LogoutIcon /></ListItemIcon>
        <ListItemText primary="Cerrar sesión" />
      </ListItem>
    </List>
  </Box>
</Drawer>


      <Box component="main" sx={{
        flexGrow: 1,
        mt: 8,
        p: 2,
        width: '100%',
        height: 'calc(100vh - 64px)', // altura sin AppBar
        overflow: 'hidden'
      }}>
        {children}
      </Box>

      <Dialog open={confirmLogout} onClose={() => setConfirmLogout(false)}>
        <DialogTitle>¿Deseas cerrar sesión?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmLogout(false)}>Cancelar</Button>
          <Button onClick={confirmarCerrarSesion} color="error" variant="contained">Cerrar sesión</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Sidebar;

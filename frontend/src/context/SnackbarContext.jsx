
import React, { createContext, useState, useContext } from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnackbarProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('success');

  const mostrar = (msg, severity = 'success') => {
    setMensaje(msg);
    setTipo(severity);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ mostrar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpen(false)} severity={tipo} variant="filled">
          {mensaje}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

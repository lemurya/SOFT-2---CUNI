import React from 'react';
import AppRouter from './router/AppRouter';
import { SnackbarProvider } from './context/SnackbarContext';

function App() {
  return (
    <SnackbarProvider>
      <AppRouter />
    </SnackbarProvider>
  );
}

export default App;

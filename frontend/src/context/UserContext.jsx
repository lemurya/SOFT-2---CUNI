import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [usuario, setUsuarioState] = useState(() => {
    const stored = localStorage.getItem('usuario');
    return stored ? JSON.parse(stored) : null;
  });

  const setUsuario = (nuevoUsuario) => {
    setUsuarioState(prev => {
      const actualizado = { ...prev, ...nuevoUsuario };

      // ✅ Guarda solo si hay cambios reales
      const antes = JSON.stringify(prev);
      const despues = JSON.stringify(actualizado);
      if (antes !== despues) {
        localStorage.setItem('usuario', despues);
      }

      return actualizado;
    });
  };

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsuario = () => useContext(UserContext);

import React, { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UserContext';
import silla from '../assets/silla.png';
import mesa from '../assets/mesa.png';
import habitacion from '../assets/room.jpg';
import InventarioPanel from './InventarioPanel';
import AvatarVestido from './AvatarVestido';
import '../styles/room.css';

const assetMap = { silla, mesa };

export default function Room() {
  const { usuario } = useUsuario();
  const userId = usuario?.id;
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [dragIdx, setDragIdx] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showInv, setShowInv] = useState(false);

  // 🏠 Carga inicial de habitación
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/room?usuario_id=${userId}`)
      .then(r => r.json())
      .then(d => setItems(d.items))
      .catch(console.error);
  }, [userId]);

  // ➕ Añadir silla/mesa
  const addItem = tipo => {
    if (!userId) return;
    const newItem = { name: tipo, imageUrl: tipo, posX: '200px', posY: '200px' };
    fetch('/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId, tipo, datos: newItem })
    })
      .then(r => r.json())
      .then(d => setItems(d.items))
      .catch(console.error);
  };

  // 🧹 Resetear habitación
  const resetRoom = () => {
    if (!userId) return;
    fetch(`/api/room?usuario_id=${userId}`, { method: 'DELETE' })
      .then(() => setItems([]))
      .catch(console.error);
  };

  // 💾 Guardar posiciones
  const saveRoom = () => {
    if (!userId) return;
    fetch('/api/room/guardar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: userId, items })
    })
      .then(() => alert('Guardado correctamente'))
      .catch(() => alert('Error al guardar'));
  };

  // 🎯 Drag & drop
  const onMouseDown = (e, idx) => {
    setDragIdx(idx);
    const rect = e.target.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const onMouseMove = e => {
    if (dragIdx === null) return;
    const roomRect = document.querySelector('.room-area').getBoundingClientRect();
    const x = e.clientX - roomRect.left - offset.x;
    const y = e.clientY - roomRect.top - offset.y;
    setItems(prev => {
      const copy = [...prev];
      copy[dragIdx] = { ...copy[dragIdx], posX: `${x}px`, posY: `${y}px` };
      fetch(`/api/room/${dragIdx}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id: userId, posicion: copy[dragIdx] })
      }).catch(console.error);
      return copy;
    });
  };
  const onMouseUp = () => setDragIdx(null);

  return (
    <Box className="room-wrapper"
         onMouseMove={onMouseMove}
         onMouseUp={onMouseUp}>

      {/* Controles */}
      <Box className="controls">
        <Button variant="contained" color="primary" onClick={() => addItem('silla')}>
          Agregar Silla
        </Button>
        <Button variant="contained" color="primary" onClick={() => addItem('mesa')}>
          Agregar Mesa
        </Button>
        <Button variant="contained" color="primary" onClick={resetRoom}>
          Resetear
        </Button>
        <Button variant="contained" color="primary" onClick={saveRoom}>
          Guardar
        </Button>
        <Button variant="contained" color="primary" onClick={() => setShowInv(true)}>
          Inventario
        </Button>
      </Box>

      {/* Habitación */}
      <Box className="room-area" style={{ backgroundImage: `url(${habitacion})` }}>
        <div className="avatar-container">
          <AvatarVestido />
        </div>
        {items.map((it, i) => (
          <img
            key={i}
            src={assetMap[it.imageUrl]}
            alt={it.name}
            className="room-item"
            style={{ left: it.posX, top: it.posY }}
            onMouseDown={e => onMouseDown(e, i)}
            draggable={false}
          />
        ))}
      </Box>

      {/* Sidebar a la derecha */}
      {showInv && (
        <Box className="sidebar">
          <Button className="close-btn" onClick={() => setShowInv(false)}>×</Button>
          <InventarioPanel usuarioId={userId} />
          <Button
            variant="contained"
            color="primary"
            className="full-btn"
            onClick={() => navigate('/inventario')}
          >
            Ver inventario completo
          </Button>
        </Box>
      )}
    </Box>
  );
}

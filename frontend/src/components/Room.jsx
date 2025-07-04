// src/components/Room.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UserContext';
import silla from '../assets/silla.png';
import mesa from '../assets/mesa.png';
import habitacion from '../assets/room.jpg';
import InventarioPanel from './InventarioPanel';
import '../styles/room.css';

const assetMap = { silla, mesa };

const Room = () => {
  const [items, setItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [girar, setGirar] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const usuario_id = usuario?.id;

  // Carga inicial de ítems en habitación
  useEffect(() => {
    if (!usuario_id) return;
    fetch(`http://localhost:3000/api/room?usuario_id=${usuario_id}`)
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error al cargar habitación', err));
  }, [usuario_id]);

  // Agregar silla o mesa
  const addItem = tipo => {
    if (!usuario_id) return;
    const newItem = {
      name: tipo,
      imageUrl: tipo,
      posX: `${Math.floor(Math.random() * 500)}px`,
      posY: `${Math.floor(Math.random() * 400)}px`,
    };
    fetch('http://localhost:3000/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id, tipo, datos: newItem }),
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'No se pudo agregar el ítem');
          setTimeout(() => setError(''), 3000);
        } else {
          setItems(data.items);
        }
      })
      .catch(() => {
        setError('Error de conexión');
        setTimeout(() => setError(''), 3000);
      });
  };

  // Resetear habitación
  const resetRoom = () => {
    if (!usuario_id) return;
    fetch(`http://localhost:3000/api/room?usuario_id=${usuario_id}`, { method: 'DELETE' })
      .then(() => setItems([]))
      .catch(err => console.error('Error al resetear', err));
  };

  // Guardar posiciones en backend
  const guardarCambios = async () => {
    if (!usuario_id) return;
    try {
      await fetch('http://localhost:3000/api/room/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, items }),
      });
      alert('Cambios guardados correctamente.');
    } catch {
      alert('Error al guardar los cambios.');
    }
  };

  // Drag & drop handlers
  const handleMouseDown = (e, index) => {
    setDraggedItemIndex(index);
    const rect = e.target.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = e => {
    if (draggedItemIndex === null) return;
    const roomRect = document.querySelector('.room').getBoundingClientRect();
    const x = e.clientX - roomRect.left - offset.x;
    const y = e.clientY - roomRect.top - offset.y;
    setItems(prev => {
      const updated = [...prev];
      updated[draggedItemIndex] = {
        ...updated[draggedItemIndex],
        posX: `${x}px`,
        posY: `${y}px`,
      };
      // Actualizar en backend
      fetch(`http://localhost:3000/api/room/${draggedItemIndex}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id,
          posicion: { posX: updated[draggedItemIndex].posX, posY: updated[draggedItemIndex].posY }
        }),
      }).catch(err => console.error('Error al actualizar posición', err));
      return updated;
    });
  };

  const handleMouseUp = () => setDraggedItemIndex(null);

  // Animación de Cuni
  const handleCuniClick = () => {
    setGirar(true);
    setTimeout(() => setGirar(false), 1000);
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ display: 'flex' }}>
      
      {/* === Columna Izquierda === */}
      <div style={{ width: showPanel ? '75vw' : '100vw', height: '100vh', position: 'relative' }}>
        <div className="controls">
          <button onClick={() => addItem('silla')}>Agregar Silla</button>
          <button onClick={() => addItem('mesa')}>Agregar Mesa</button>
          <button onClick={resetRoom}>Resetear Habitación</button>
          <button onClick={guardarCambios}>Guardar Cambios</button>
          <button onClick={() => setShowPanel(true)}>Inventario</button>
        </div>

        {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}

        <div
          className="room"
          style={{
            backgroundImage: `url(${habitacion})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <img
            src="/img/cuni.png"
            alt="Cuni"
            className={`cuni-img ${girar ? 'girar' : ''}`}
            onClick={handleCuniClick}
            draggable={false}
          />

          {items.map((item, idx) => (
            <img
              key={idx}
              src={assetMap[item.imageUrl]}
              alt={item.name}
              style={{
                position: 'absolute',
                left: item.posX,
                top: item.posY,
                width: '180px',
                cursor: 'grab',
                userSelect: 'none',
              }}
              onMouseDown={e => handleMouseDown(e, idx)}
              draggable={false}
            />
          ))}
        </div>
      </div>

      {/* === Columna Derecha: Sidebar de Inventario === */}
      {showPanel && (
        <div
          style={{
            position: 'relative',
            width: '25vw',
            height: '100vh',
            overflowY: 'auto',
            background: '#FFFCEC',
            padding: '16px',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.1)'
          }}
        >
          {/* -- Botón X de cierre -- */}
          <button
            onClick={() => setShowPanel(false)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
          >×</button>

          {/* -- Panel de inventario -- */}
          <InventarioPanel usuarioId={usuario_id} />

          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <button onClick={() => navigate('/inventario')}>
              Ver inventario completo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Room;

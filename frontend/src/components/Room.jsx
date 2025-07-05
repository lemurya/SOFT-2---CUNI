import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../context/UserContext';
import silla from '../assets/silla.png';
import mesa from '../assets/mesa.png';
import habitacion from '../assets/room.jpg';
import '../styles/room.css';
import { Button, Box } from '@mui/material'; 

import InventarioPanel from './InventarioPanel'; 

const assetMap = { silla, mesa };

const Room = () => {
  const [items, setItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const [girar, setGirar] = useState(false);
  const [mostrarInventario, setMostrarInventario] = useState(false);
  const navigate = useNavigate();

  const { usuario } = useUsuario();
  const usuario_id = usuario?.id;

  useEffect(() => {
    if (!usuario_id) return;
    fetch(`http://localhost:3000/api/room?usuario_id=${usuario_id}`)
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error al cargar habitación', err));
  }, [usuario_id]);

  const addItem = (tipo) => {
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
      body: JSON.stringify({ usuario_id, tipo, datos: newItem })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'No se pudo agregar el ítem');
          setTimeout(() => setError(''), 3000);
          return;
        }
        setItems(data.items);
      })
      .catch(err => {
        console.error('Error al agregar ítem', err);
        setError('Error de conexión');
        setTimeout(() => setError(''), 3000);
      });
  };

  const resetRoom = () => {
    if (!usuario_id) return;
    fetch(`http://localhost:3000/api/room?usuario_id=${usuario_id}`, { method: 'DELETE' })
      .then(() => setItems([]))
      .catch(err => console.error('Error al resetear', err));
  };

  const handleMouseDown = (e, index) => {
    setDraggedItemIndex(index);
    const rect = e.target.getBoundingClientRect();
    setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e) => {
    if (draggedItemIndex === null) return;
    const roomRect = document.querySelector('.room').getBoundingClientRect();
    const x = e.clientX - roomRect.left - offset.x;
    const y = e.clientY - roomRect.top - offset.y;

    setItems((prev) => {
      const updated = [...prev];
      updated[draggedItemIndex] = {
        ...updated[draggedItemIndex],
        posX: `${x}px`,
        posY: `${y}px`,
      };
      updateItemPosition(draggedItemIndex, updated[draggedItemIndex]);
      return updated;
    });
  };

  const updateItemPosition = (index, newItem) => {
    if (!usuario_id) return;
    fetch(`http://localhost:3000/api/room/${index}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id,
        posicion: { posX: newItem.posX, posY: newItem.posY }
      })
    }).catch(err => console.error('Error al actualizar posición', err));
  };

  const guardarCambios = async () => {
    if (!usuario_id) return;

    try {
      await fetch('http://localhost:3000/api/room/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario_id, items }),
      });
      alert('Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios.');
    }
  };

  const handleMouseUp = () => setDraggedItemIndex(null);

  const handleCuniClick = () => {
    setGirar(true);
    setTimeout(() => setGirar(false), 1000);
  };

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div className="controls">
          <button onClick={() => addItem('silla')}>Agregar Silla</button>
          <button onClick={() => addItem('mesa')}>Agregar Mesa</button>
          <button onClick={resetRoom}>Resetear Habitación</button>
          <button onClick={guardarCambios}>Guardar Cambios</button>
          <button onClick={() => setMostrarInventario(!mostrarInventario)}>
            {mostrarInventario ? 'Ocultar Inventario' : 'Mostrar Inventario'}
          </button>
          <button onClick={() => navigate('/inventario')}>Ir al Inventario Completo</button>
        </div>

        {error && (
          <div style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>
        )}

        <div
          className="room"
          style={{
            backgroundImage: `url(${habitacion})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            width: '100%',
            height: '90vh',
          }}
        >
          <img
            src="/img/cuni.png"
            alt="Cuni"
            className={`cuni-img ${girar ? 'girar' : ''}`}
            onClick={handleCuniClick}
            draggable={false}
          />

          {items.map((item, index) => (
            <img
              key={index}
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
              onMouseDown={(e) => handleMouseDown(e, index)}
              draggable={false}
            />
          ))}
        </div>
      </div>


      {mostrarInventario && (
        <Box
          sx={{
            width: '350px',
            height: '100vh',
            overflowY: 'auto',
            borderLeft: '1px solid #ccc',
            bgcolor: '#fafafa',
            p: 2,
          }}
        >
          <InventarioPanel usuarioId={usuario_id} />
        </Box>
      )}
    </div>
  );
};

export default Room;

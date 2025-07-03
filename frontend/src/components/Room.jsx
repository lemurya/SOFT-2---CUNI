import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import silla from '../assets/silla.png';
import mesa from '../assets/mesa.png';
import habitacion from '../assets/room.jpg';
import '../styles/room.css';

const assetMap = { silla, mesa };

const Room = () => {
  const [items, setItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usuario_id = 1; // Aquí deberías usar el ID real del usuario autenticado

  // 🔄 Cargar ítems al montar
  useEffect(() => {
    fetch(`http://localhost:3000/api/room?usuario_id=${usuario_id}`)
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error al cargar habitación', err));
  }, []);

  // ➕ Agregar ítem (con validación)
  const addItem = (tipo) => {
    const count = items.filter(i => i.name === tipo).length;
    if (count >= 2) {
      setError(`Inventario insuficiente de ${tipo}`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    const newItem = {
      name: tipo,
      imageUrl: tipo,
      posX: `${Math.floor(Math.random() * 500)}px`,
      posY: `${Math.floor(Math.random() * 400)}px`,
    };

    fetch('http://localhost:3000/api/room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario_id,
        tipo,
        datos: newItem
      })
    })
      .then(res => res.json())
      .then(data => setItems(data.items))
      .catch(err => console.error('Error al agregar ítem', err));
  };

  // 🔄 Reset
  const resetRoom = () => {
    fetch(`http://localhost:3000/api/room?usuario_id=${usuario_id}`, {
      method: 'DELETE'
    })
      .then(() => setItems([]))
      .catch(err => console.error('Error al resetear', err));
  };

  // ⬇️ Drag and drop
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
    try {
      await fetch('http://localhost:3000/api/room/guardar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario_id: 1,  // <- ajusta si usas otro ID dinámico
          items,
        }),
      });
  
      alert('Cambios guardados correctamente.');
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Error al guardar los cambios.');
    }
  };
  
  

  const handleMouseUp = () => setDraggedItemIndex(null);

  return (
    <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      <div className="controls">
        <button onClick={() => addItem('silla')}>Agregar Silla</button>
        <button onClick={() => addItem('mesa')}>Agregar Mesa</button>
        <button onClick={resetRoom}>Resetear Habitación</button>
        <button onClick={guardarCambios}>Guardar Cambios</button>
        <button onClick={() => navigate('/inventario')}>Inventario</button>
        
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
          width: '100vw',
          height: '100vh',
        }}
      >
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
  );
};

export default Room;

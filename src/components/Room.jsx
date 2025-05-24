import { useEffect, useState } from 'react';
import axios from 'axios';
import silla from '../assets/silla.png';
import mesa from '../assets/mesa.png';
import habitacion from '../assets/room.jpg';
import '../styles/room.css';

const API_URL = 'http://localhost:3000/api/room';

const assetMap = {
  silla,
  mesa,
};

const Room = () => {
  const [items, setItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const usuarioId = usuario?.id;

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_URL}?usuario_id=${usuarioId}`);
      setItems(res.data.items);
      console.log('Items en habitación:', res.data.items);
    } catch (err) {
      console.error('Error al obtener ítems:', err);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      fetchItems();
    }
  }, [usuarioId]);

  const equipItem = async (tipo) => {
    const datos = {
      name: tipo,
      imageUrl: tipo,
      posX: `${Math.floor(Math.random() * 500)}px`,
      posY: `${Math.floor(Math.random() * 400)}px`,
    };

    try {
      await axios.post(API_URL, {
        usuario_id: usuarioId,
        tipo,
        datos,
      });

      // Espera 200 ms antes de volver a cargar
      setTimeout(() => {
        fetchItems();
      }, 200);

    } catch (err) {
      console.error('Error al agregar ítem:', err);
    }
  };


  const resetRoom = async () => {
    try {
      await axios.delete(`${API_URL}?usuario_id=${usuarioId}`);
      await fetchItems();
    } catch (err) {
      console.error('Error al reiniciar habitación:', err);
    }
  };

  const handleMouseDown = (e, index) => {
    setDraggedItemIndex(index);
    const rect = e.target.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedItemIndex === null) return;

      const roomRect = document.querySelector('.room').getBoundingClientRect();
      const x = e.clientX - roomRect.left - offset.x;
      const y = e.clientY - roomRect.top - offset.y;

      setItems((prevItems) => {
        const updated = [...prevItems];
        updated[draggedItemIndex].posX = `${x}px`;
        updated[draggedItemIndex].posY = `${y}px`;
        return updated;
      });
    };

    const handleMouseUp = () => {
      setDraggedItemIndex(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedItemIndex, offset]);

  return (
    <div>
      <div className="controls" style={{ padding: '1rem' }}>
        <button onClick={() => equipItem('silla')}>Agregar Silla</button>
        <button onClick={() => equipItem('mesa')}>Agregar Mesa</button>
        <button onClick={resetRoom}>Resetear Habitación</button>
      </div>
  
      <div
        className="room"
        style={{
          backgroundImage: `url(${habitacion})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {items
          .filter((item) => assetMap[item.imageUrl]) // ya no usamos .replace
          .map((item, index) => (
            <img
              key={index}
              src={assetMap[item.imageUrl]} // sin .replace
              alt={item.name}
              className="item"
              style={{
                left: item.posX || '50px',
                top: item.posY || '50px',
                position: 'absolute',
                cursor: 'grab',
                width: '200px',
                height: 'auto',
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

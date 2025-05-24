import { useEffect, useState } from 'react';
import axios from 'axios';
import silla from '../assets/silla.png';
import mesa from '../assets/mesa.png';
import habitacion from '../assets/room.jpg';  // Importamos la imagen de fondo

const API_URL = 'http://localhost:3000/api/room';

const assetMap = {
  silla,
  mesa,
};

const Room = () => {
  const [items, setItems] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const fetchItems = async () => {
    try {
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch (err) {
      console.error('Error al obtener ítems:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const equipItem = async (type) => {
    try {
      const item = {
        name: type,
        imageUrl: `${type}.png`,
        posX: `${Math.floor(Math.random() * 500)}px`,
        posY: `${Math.floor(Math.random() * 400)}px`,
      };
      await axios.post(API_URL, item);
      fetchItems();
    } catch (err) {
      console.error('Error al agregar ítem:', err);
    }
  };

  const resetRoom = async () => {
    try {
      await axios.delete(API_URL);
      fetchItems();
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
      <div className="controls">
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
        {items.map((item, index) => (
          <img
            key={index}
            src={assetMap[item.name.toLowerCase()]}
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
            draggable={false}  // para evitar conflicto con drag nativo
          />
        ))}
      </div>
    </div>
  );
};

export default Room;

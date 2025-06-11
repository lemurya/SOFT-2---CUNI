import { useState } from 'react';
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
 const navigate = useNavigate();
 const addItem = (tipo) => {
  const newItem = {
   name: tipo,
   imageUrl: tipo,
   posX: `${Math.floor(Math.random() * 500)}px`,
   posY: `${Math.floor(Math.random() * 400)}px`,
  };
  setItems((prev) => [...prev, newItem]);
 };
 const resetRoom = () => setItems([]);
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
   return updated;
  });
 };

 const handleMouseUp = () => setDraggedItemIndex(null);

 return (
  <div onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
   <div
    className="controls"

    style={{
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: '1rem',
    }}
   >
    <div style={{ display: 'flex', gap: '1rem' }}>
     <button onClick={() => addItem('silla')}>Agregar Silla</button>
     <button onClick={() => addItem('mesa')}>Agregar Mesa</button>
     <button onClick={resetRoom}>Resetear Habitación</button>
    </div>
    <button
     onClick={() => navigate('/inventario')}
     style={{
      backgroundColor: 'orange',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
     }}
    >Inventario</button>
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


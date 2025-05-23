import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/room'; // Asegúrate de que tu backend esté en este puerto

const Room = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get(API_URL)
      .then(res => setItems(res.data))
      .catch(err => console.error('Error al obtener ítems:', err));
  }, []);

  return (
    <div className="room">
      {items.map((item, index) => (
        <img
          key={index}
          src={`/src/assets/${item.name.toLowerCase()}.png`}
          alt={item.name}
          className="item"
          style={{
            left: item.posX || '50px',
            top: item.posY || '50px'
          }}
        />
      ))}
    </div>
  );
};

export default Room;

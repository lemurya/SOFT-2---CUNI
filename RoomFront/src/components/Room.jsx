import { useEffect, useState } from 'react';
import axios from 'axios';
import silla from '../assets/silla_gamer-removebg-preview.png';
import mesa from '../assets/escritorio-removebg-preview.png';

const API_URL = 'http://localhost:3000/api/room';

const assetMap = {
  silla,
  mesa,
};

const Room = () => {
  const [items, setItems] = useState([]);

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

  return (
    <div>
      <div className="controls">
        <button onClick={() => equipItem('silla')}>Agregar Silla</button>
        <button onClick={() => equipItem('mesa')}>Agregar Mesa</button>
        <button onClick={resetRoom}>Resetear Habitación</button>
      </div>

      <div className="room">
        {items.map((item, index) => (
          <img
            key={index}
            src={assetMap[item.name.toLowerCase()]}
            alt={item.name}
            className="item"
            style={{
              left: item.posX || '50px',
              top: item.posY || '50px'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Room;

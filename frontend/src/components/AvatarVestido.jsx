
import React, { useEffect, useState } from 'react';
import { useUsuario } from '../context/UserContext';


const combinedMap = {
  'Gorro Andino':      '/img/cuyGorra.png',
  'Chaleco de Alpaca': '/img/cuyChompa.png',
  'Bufanda Morada':    '/img/cuyBufanda.png',
  default:             '/img/cuni.png',
};

export default function AvatarVestido() {
  const { usuario } = useUsuario();
  const [equipped, setEquipped] = useState(null);

  useEffect(() => {
    fetch(`/api/tienda/mis-items/${usuario.id}`)
      .then(res => res.json())
      .then(items => {
        console.log('MIS ITEMS DESDE API:', items);
        
        const activo = items.find(i => i.enUso);
        setEquipped(activo ? activo.nombre : null);
      })
      .catch(console.error);
  }, [usuario.id]);


  const src = combinedMap[equipped] || combinedMap.default;

  return (
    <div className="avatar-container">
      <img
        src={src}
        alt="Cuy vestido"
        className="avatar-base"
      />
    </div>
  );
}
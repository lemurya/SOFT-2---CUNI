import React from 'react';
import { Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const ReporteCard = ({ tema, onClick }) => (
  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
    <Card
      elevation={3}
      sx={{
        textAlign: 'center',
        p: 3,
        cursor: 'pointer',
        borderRadius: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={onClick}
    >
      {tema.icono}
      <Typography variant="h6" fontWeight="bold" sx={{ mt: 1 }}>
        {tema.nombre.toUpperCase()}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Ver evolución y detalles
      </Typography>
    </Card>
  </motion.div>
);

export default ReporteCard;

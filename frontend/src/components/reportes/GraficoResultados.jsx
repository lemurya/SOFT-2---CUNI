import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';
import { Box } from '@mui/material';

const GraficoResultados = ({ data }) => (
  <Box sx={{ height: 350 }}>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="intento" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="correctas" fill="#4caf50" name="Correctas" />
        <Bar dataKey="incorrectas" fill="#f44336" name="Incorrectas" />
      </BarChart>
    </ResponsiveContainer>
  </Box>
);

export default GraficoResultados;

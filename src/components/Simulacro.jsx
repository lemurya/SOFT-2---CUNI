import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, RadioGroup, FormControlLabel,
  Radio, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

const Simulacro = () => {
  const [usuario, setUsuario] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuesta, setRespuesta] = useState('');
  const [finalizado, setFinalizado] = useState(false);
  const [temaSeleccionado, setTemaSeleccionado] = useState('');
  const [temas] = useState(["matematica", "verbal", "ciencias", "historia"]);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if (datos) setUsuario(datos);
  }, []);

  const iniciarSimulacro = async () => {
    if (!temaSeleccionado) {
      alert("Por favor selecciona un tema");
      return;
    }

    await fetch("http://localhost:3000/api/simulacro/iniciar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: usuario.id, tema: temaSeleccionado })
    });

    const res = await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/todas`);
    const data = await res.json();
    setPreguntas(data);
    setIndiceActual(0);
    setFinalizado(false);
    setRespuesta('');
  };

  const responder = async () => {
    if (!respuesta) return alert("Selecciona una respuesta");

    await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuesta })
    });

    if (indiceActual + 1 < preguntas.length) {
      setIndiceActual(indiceActual + 1);
      setRespuesta('');
    } else {
      setFinalizado(true);
    }
  };

  const verResultados = async () => {
    const res = await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/resultados`);
    const data = await res.json();
    alert(`Total: ${data.total}\nCorrectas: ${data.correctas}\nIncorrectas: ${data.incorrectas}`);

    const actualizado = {
      ...usuario,
      experiencia: usuario.experiencia + data.experienciaGanada,
      monedas: usuario.monedas + data.monedasGanadas
    };

    localStorage.setItem("usuario", JSON.stringify(actualizado));
    setUsuario(actualizado);
  };

  const preguntaActual = preguntas[indiceActual];

  return (
    <Paper sx={{ p: 4 }}>
      {!preguntas.length ? (
        <Box>
          <Typography variant="h6" gutterBottom>Selecciona un tema para comenzar</Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Tema</InputLabel>
            <Select
              value={temaSeleccionado}
              label="Tema"
              onChange={(e) => setTemaSeleccionado(e.target.value)}
            >
              {temas.map((tema) => (
                <MenuItem key={tema} value={tema}>{tema}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={iniciarSimulacro}>Iniciar Simulacro</Button>
        </Box>
      ) : finalizado ? (
        <Box>
          <Typography variant="h6" gutterBottom>Simulacro finalizado</Typography>
          <Button variant="contained" onClick={verResultados}>Ver resultados</Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6">Pregunta {indiceActual + 1}</Typography>
          <Typography sx={{ my: 2 }}>{preguntaActual?.question}</Typography>
          <RadioGroup value={respuesta} onChange={(e) => setRespuesta(e.target.value)}>
            {preguntaActual?.options.map((opt, i) => (
              <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
            ))}
          </RadioGroup>
          <Button variant="contained" onClick={responder} sx={{ mt: 2 }}>
            Responder
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default Simulacro;

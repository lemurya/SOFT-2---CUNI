import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Button, RadioGroup, FormControlLabel,
  Radio, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Simulacro = () => {
  const [usuario, setUsuario] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respondidas, setRespondidas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuesta, setRespuesta] = useState('');
  const [finalizado, setFinalizado] = useState(false);
  const [temaSeleccionado, setTemaSeleccionado] = useState('');
  const [tiempo, setTiempo] = useState(300);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);
  const [temas] = useState(["matematica", "verbal", "ciencias", "historia"]);
  const navigate = useNavigate();

  // Cargar usuario desde localStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if (datos) setUsuario(datos);
  }, []);

  // Iniciar simulacro
  const iniciarSimulacro = async () => {
    if (!temaSeleccionado) {
      alert("Por favor selecciona un tema");
      return;
    }

    if (!usuario || !usuario.id) {
      alert("Usuario no válido. Por favor inicia sesión nuevamente.");
      return;
    }

    await fetch("http://localhost:3000/api/simulacro/iniciar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: usuario.id, tema: temaSeleccionado })
    });

    const res = await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/todas`);
    const data = await res.json();
    console.log("Preguntas recibidas:", data);
    setPreguntas(data);
    setIndiceActual(0);
    setFinalizado(false);
    setRespuesta('');
    setTiempo(300);
    setTemporizadorActivo(true);
  };

  // Enviar respuesta
  const responder = async () => {
    if (!respuesta) {
      alert("Por favor selecciona una respuesta");
      return;
    }

    const res = await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/responder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ respuesta })
    });

    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Responder la pregunta");
      return;
    }

    setRespondidas((prev) => {
      const nuevas = [...prev];
      nuevas[indiceActual] = { respondida: true, correcta: data.esCorrecta };
      return nuevas;
    });

    if (indiceActual + 1 < preguntas.length) {
      setIndiceActual(indiceActual + 1);
      setRespuesta('');
    } else {
      setFinalizado(true);
    }
  };

  // Ver resultados
  const verResultados = async () => {
    const res = await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/resultados`);
    const data = await res.json();

    const actualizado = {
      ...usuario,
      experiencia: usuario.experiencia + data.experienciaGanada,
      monedas: usuario.monedas + data.monedasGanadas
    };

    localStorage.setItem("usuario", JSON.stringify(actualizado));
    navigate('/resultados', { state: data });
  };

  // Temporizador
  useEffect(() => {
    let intervalo = null;

    if (temporizadorActivo && tiempo > 0) {
      intervalo = setInterval(() => {
        setTiempo((prev) => prev - 1);
      }, 1000);
    } else if (tiempo === 0 && preguntas.length > 0 && !finalizado) {
      setFinalizado(true);
      alert("⏰ El tiempo ha terminado. Se cerró el simulacro automáticamente.");
      clearInterval(intervalo);
    }

    return () => clearInterval(intervalo);
  }, [temporizadorActivo, tiempo, preguntas, finalizado]);


  useEffect(() => {
  const estado = respondidas[indiceActual];
  if (estado?.seleccion) {
        setRespuesta(estado.seleccion);
      } else {
        setRespuesta('');
      }
    }, [indiceActual, respondidas]);

  const preguntaActual = preguntas[indiceActual] || {};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9F6FF', display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: '100%', borderRadius: 4 }}>
        {!preguntas.length ? (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Selecciona un tema para comenzar
            </Typography>

            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Tema</InputLabel>
              <Select
                value={temaSeleccionado}
                label="Tema"
                onChange={(e) => setTemaSeleccionado(e.target.value)}
              >
                {temas.map((tema) => (
                  <MenuItem key={tema} value={tema}>
                    {tema.charAt(0).toUpperCase() + tema.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="body2" align="center" sx={{ mb: 2 }}>
              Tiempo disponible: {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, '0')} minutos
            </Typography>

            <Button
              variant="contained"
              onClick={iniciarSimulacro}
              sx={{ bgcolor: '#5D3FD3', '&:hover': { bgcolor: '#4528a4' }, borderRadius: 2 }}
              fullWidth
            >
              Iniciar Simulacro
            </Button>
          </Box>
        ) : finalizado ? (
          <Box textAlign="center">
            <Typography variant="h6" gutterBottom>Simulacro finalizado</Typography>
            <Button variant="contained" onClick={verResultados}>Ver resultados</Button>
          </Box>
        ) : (
          <Box>
            {/* Botones de navegación por pregunta */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {preguntas.map((_, index) => {
                const estado = respondidas[index];
                let color = 'inherit';
                 
                if (estado?.respondida === true) {
                  color = 'secondary';
                }

                
                return (
                  <Button
                    key={index}
                    variant={index === indiceActual ? 'contained' : 'outlined'}
                    color={color}
                    onClick={() => setIndiceActual(index)}
                    size="small"
                  >
                    {index + 1}
                  </Button>
                );
              })}
            </Box>

            <Typography variant="h6" fontWeight="bold">
              Pregunta {indiceActual + 1}
            </Typography>

            <Typography variant="body2" align="center" sx={{ mb: 2, color: tiempo < 30 ? 'red' : 'inherit' }}>
              Tiempo restante: {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, '0')}
            </Typography>

            <Typography sx={{ my: 2 }}>{preguntaActual.pregunta}</Typography>

            <RadioGroup
              value={respuesta}
              onChange={async (e) => {
                const seleccionada = e.target.value;
                setRespuesta(seleccionada);

                setRespondidas((prev) => {
                  const nuevas = [...prev];
                  nuevas[indiceActual] = { respondida: true, seleccion: seleccionada};
                  return nuevas;
                });

               await fetch(`http://localhost:3000/api/simulacro/${usuario.id}/responder`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ respuesta: seleccionada, indice: indiceActual })
                });
                  }}
                >
              {Array.isArray(preguntaActual.opciones) &&
                preguntaActual.opciones.map((opt, i) => (
                  <FormControlLabel key={i} value={opt} control={<Radio />} label={opt} />
                ))}
            </RadioGroup>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  variant="outlined"
                  disabled={indiceActual === 0}
                  onClick={() => setIndiceActual((prev) => prev - 1)}
                >
                  Atrás
                </Button>

                {indiceActual < preguntas.length - 1 ? (
                  <Button
                    variant="outlined"
                    onClick={() => setIndiceActual((prev) => prev + 1)}
                  >
                    Siguiente
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={verResultados}
                  >
                    Finalizar simulacro
                  </Button>
                )}
              </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Simulacro;

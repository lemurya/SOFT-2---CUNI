import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, RadioGroup, FormControlLabel,
  Radio, FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const Simulacro = () => {
  // Usuario y navegación
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  // Preguntas y simulacro
  const [preguntas, setPreguntas] = useState([]);
  const [respondidas, setRespondidas] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [respuesta, setRespuesta] = useState('');
  const [finalizado, setFinalizado] = useState(false);

  // Configuración
  const [temaSeleccionado, setTemaSeleccionado] = useState('');
  const [temas] = useState(["matematica", "verbal", "ciencias", "historia"]);

  // Tiempo
  const [tiempo, setTiempo] = useState(300);
  const [temporizadorActivo, setTemporizadorActivo] = useState(false);


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

  const TiempoRestante = () => (
  <Typography
    variant="body2"
    data-testid="temporizador" 
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1,
      mb: 2,
      fontWeight: 'bold',
      color: tiempo < 30 ? 'error.main' : '#5D3FD3'
    }}
  >
    <AccessTimeIcon fontSize="small" />
    Tiempo restante: {Math.floor(tiempo / 60)}:{(tiempo % 60).toString().padStart(2, '0')}
  </Typography>
);


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


  // Cargar usuario desde localStorage
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    if (datos) setUsuario(datos);
  }, []);

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
    <Box sx={{ minHeight: '100vh', bgcolor: '#F5F8FE', display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2 }}>
      <Paper elevation={4} sx={{ p: 4, maxWidth: 800, width: '100%', borderRadius: 4, boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
       bgcolor: 'white', textAlign: 'center'}}>
        {!preguntas.length ? (
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Selecciona un tema para comenzar
            </Typography>

            <FormControl fullWidth sx={{ my: 2 }}>
              <InputLabel>Tema</InputLabel>
              <Select
                fullWidth
                value={temaSeleccionado}
                onChange={(e) => setTemaSeleccionado(e.target.value)}
                displayEmpty
                sx={{
                  borderRadius: 2,
                  bgcolor: '#F9F6FF',
                  boxShadow: 1,
                  '&:hover': { bgcolor: '#EEEAF9' }
                }}
              >
                {temas.map((tema) => (
                  <MenuItem key={tema} value={tema}>
                    {tema.charAt(0).toUpperCase() + tema.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

           <TiempoRestante />

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
                let variant = 'outlined';

                if (index === indiceActual) {
                  variant = 'contained'; // Pregunta activa
                } else if (estado?.respondida === true) {
                  variant = 'contained'; // Pregunta respondida (aunque no esté activa)
                  color = 'secondary';
                }

                return (
                  <Button
                  key={index}
                  variant="contained"
                  onClick={() => setIndiceActual(index)}
                  sx={{
                    borderRadius: 3,
                    width: 40,
                    height: 40,
                    fontWeight: 'bold',
                    backgroundColor: index === indiceActual
                      ? '#5D3FD3'
                      : respondidas[index]?.respondida
                      ? '#B39DDB'
                      : 'transparent',
                    color: index === indiceActual ? 'white' : '#5D3FD3',
                    '&:hover': {
                      backgroundColor: index === indiceActual ? '#4528a4' : '#D1C4E9'
                    }
                  }}
                >
                  {index + 1}
                </Button>

                );
              })}
            </Box>

            <TiempoRestante />

            <Paper
              elevation={2}
              sx={{
                p: 3,
                my: 2,
                textAlign: 'left',
                bgcolor: '#FAFAFA',
                borderRadius: 3,
                border: '1px solid #E0E0E0'
              }}
            >
              <Typography variant="h6" component="h2" fontWeight="bold" gutterBottom>
                Pregunta {indiceActual + 1}:
              </Typography>
              <Typography sx={{ mb: 1 }}>
                {preguntaActual.pregunta}
              </Typography>
            </Paper>

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
                  <FormControlLabel key={i} value={opt} control={<Radio sx={{ color: '#5D3FD3', '&.Mui-checked': { color: '#5D3FD3' } }} />} label={<Box sx={{ p: 1, borderRadius: 2, bgcolor: respuesta === opt ? '#EDE7F6' : 'transparent' }}>{opt}</Box>} />
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
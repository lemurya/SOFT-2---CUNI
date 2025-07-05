const TiendaController = require('../controllers/TiendaController');
const tiendaService = require('../services/TiendaService');

jest.mock('../services/TiendaService');

describe('TiendaController.usarItem', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        usuarioId: 1,
        itemNombre: 'Silla'
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('✅ debe activar un ítem correctamente', async () => {
    const resultadoMock = { mensaje: 'Ítem activado', en_uso: true };
    tiendaService.activarItem.mockResolvedValue(resultadoMock);

    await TiendaController.usarItem(req, res);

    expect(tiendaService.activarItem).toHaveBeenCalledWith(1, 'Silla');
    expect(res.json).toHaveBeenCalledWith(resultadoMock);
  });

  it('❌ debe retornar error 400 si faltan datos', async () => {
    req.body = {}; // sin usuarioId ni itemNombre

    await TiendaController.usarItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Faltan datos para activar ítem' });
  });

  it('❌ debe manejar errores del servicio con 500', async () => {
    tiendaService.activarItem.mockRejectedValue(new Error('Error interno'));

    await TiendaController.usarItem(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.any(Error));
  });

  it('🛡️ debe validar que el servicio fue llamado una vez', async () => {
    tiendaService.activarItem.mockResolvedValue({ ok: true });

    await TiendaController.usarItem(req, res);

    expect(tiendaService.activarItem).toHaveBeenCalledTimes(1);
  });
});

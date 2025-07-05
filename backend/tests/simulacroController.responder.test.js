const { responder } = require('../controllers/simulacroController');
const manager = require('../managers/simulacroManager');

jest.mock('../managers/simulacroManager');

describe('responder (simulacroController)', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { userId: '1' },
      body: { respuesta: '5', indice: 0 }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  it('responde exitosamente si hay simulacro activo', () => {
    manager.get.mockReturnValue({ preguntas: [{}] });

    responder(req, res);

    expect(manager.get).toHaveBeenCalledWith('1');
    expect(manager.responder).toHaveBeenCalledWith('1', '5', 0);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Respuesta registrada' });
  });

  it('retorna 400 si faltan datos en el body', () => {
    req.body = {};

    responder(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Datos incompletos' });
  });

  it('retorna 404 si no hay simulacro activo', () => {
    manager.get.mockReturnValue(null);

    responder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'No hay simulacro activo' });
  });

  it('no llama a manager.responder si la sesión no existe', () => {
    manager.get.mockReturnValue(null);

    responder(req, res);

    expect(manager.responder).not.toHaveBeenCalled();
  });
});

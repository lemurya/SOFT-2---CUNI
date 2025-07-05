const { obtenerReportesPorTema } = require('../controllers/reporteController');
const ReporteFactory = require('../factories/ReporteFactory');

jest.mock('../factories/ReporteFactory');

describe('Pruebas de caja blanca - obtenerReportesPorTema', () => {
  let req, res;

  beforeEach(() => {
    req = { params: { userId: '1', tema: 'ciencias' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  it('retorna reportes correctamente cuando todo funciona', async () => {
    const mockReporte = {
      obtener: jest.fn().mockResolvedValue([
        { tema: 'ciencias', correctas: 3, total: 3, fecha: '2025-07-01' }
      ])
    };

    ReporteFactory.crear.mockReturnValue(mockReporte);

    await obtenerReportesPorTema(req, res);

    expect(ReporteFactory.crear).toHaveBeenCalledWith('porTema', '1', 'ciencias');
    expect(res.json).toHaveBeenCalledWith({
      reportes: [{ tema: 'ciencias', correctas: 3, total: 3, fecha: '2025-07-01' }]
    });
  });

  it('maneja error si ReporteFactory.crear lanza una excepción', async () => {
    ReporteFactory.crear.mockImplementation(() => {
      throw new Error('Tipo de reporte no válido');
    });

    await obtenerReportesPorTema(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Error al obtener reportes por tema'
    });
  });

  it('maneja error si obtener() rechaza la promesa', async () => {
    const mockReporte = {
      obtener: jest.fn().mockRejectedValue(new Error('Fallo en DB'))
    };

    ReporteFactory.crear.mockReturnValue(mockReporte);

    await obtenerReportesPorTema(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: 'Error al obtener reportes por tema'
    });
  });

  it('retorna lista vacía si no hay reportes disponibles', async () => {
    const mockReporte = {
      obtener: jest.fn().mockResolvedValue([])
    };

    ReporteFactory.crear.mockReturnValue(mockReporte);

    await obtenerReportesPorTema(req, res);

    expect(res.json).toHaveBeenCalledWith({ reportes: [] });
  });

  it('verifica que ReporteFactory se llame correctamente con tipo porTema', async () => {
    const mockReporte = {
      obtener: jest.fn().mockResolvedValue([])
    };

    const spy = jest.spyOn(ReporteFactory, 'crear').mockReturnValue(mockReporte);

    await obtenerReportesPorTema(req, res);

    expect(spy).toHaveBeenCalledWith('porTema', '1', 'ciencias');
  });
});

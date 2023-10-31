import { Test, TestingModule } from '@nestjs/testing';
import { TipoEventoService } from './tipo_evento.service';



describe('TipoEventoService', () => {
  let service: TipoEventoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoEventoService],
    }).compile();

    service = module.get<TipoEventoService>(TipoEventoService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de tipos de eventos', async () => {
      // Suponha que o método findAll no serviço retorne uma lista de tipos de eventos
      const tiposDeEventos = await service.findAll();

      // Realize asserções apropriadas com base nos resultados esperados
      expect(Array.isArray(tiposDeEventos)).toBe(true);
      expect(tiposDeEventos.length).toBeGreaterThan(0);

      // Você também pode realizar asserções específicas com base em seus requisitos
      // Por exemplo, verifique se os tipos de eventos têm propriedades específicas
      tiposDeEventos.forEach((tipoEvento) => {
        expect(tipoEvento).toHaveProperty('nome');
        expect(tipoEvento).toHaveProperty('descricao');
      });
    });
  });
});
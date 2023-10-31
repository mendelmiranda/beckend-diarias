import { Test, TestingModule } from '@nestjs/testing';
import { TipoEventoService } from './tipo_evento.service';

describe('UsersService', () => {
  let service: TipoEventoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoEventoService],
    }).compile();

    service = module.get<TipoEventoService>(TipoEventoService);
  });

  it('should return all users', async () => {
    const users = await service.findAll();

    expect(users).toHaveLength(1);
    expect(users[0].descricao).toBe('APURAÇÃO DE ÍNDICE');
    
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { TipoEventoService } from './tipo_evento.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('TestTipoEventoService', () => {
  let service: TipoEventoService;
  const mockPrisma = new PrismaService();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoEventoService],
    }).overrideProvider(PrismaService).useValue(mockPrisma).compile();

    service = module.get<TipoEventoService>(TipoEventoService);
  });

  it('should return all users', async () => {
    const users = await service.findAll();

    expect(users).toHaveLength(23);
    //expect(users[0].descricao).toBe('APURAÇÃO DE ÍNDICE');
    
  });
});
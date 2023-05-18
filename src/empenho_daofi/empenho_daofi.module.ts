import { Module } from '@nestjs/common';
import { EmpenhoDaofiService } from './empenho_daofi.service';
import { EmpenhoDaofiController } from './empenho_daofi.controller';

@Module({
  controllers: [EmpenhoDaofiController],
  providers: [EmpenhoDaofiService]
})
export class EmpenhoDaofiModule {}

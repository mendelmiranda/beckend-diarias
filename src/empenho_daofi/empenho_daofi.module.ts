import { Module } from '@nestjs/common';
import { EmpenhoDaofiService } from './empenho_daofi.service';
import { EmpenhoDaofiController } from './empenho_daofi.controller';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [EmpenhoDaofiController],
  providers: [EmpenhoDaofiService, PrismaService],
})
export class EmpenhoDaofiModule {}

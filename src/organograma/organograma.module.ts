import { Module } from '@nestjs/common';
import { OrganogramaService } from './organograma.service';
import { OrganogramaController } from './organograma.controller';

@Module({
  controllers: [OrganogramaController],
  providers: [OrganogramaService]
})
export class OrganogramaModule {}

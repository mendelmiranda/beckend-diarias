import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TceApiClient } from './tce-api.client';

@Module({
  imports: [HttpModule],
  providers: [TceApiClient],
  exports: [TceApiClient],
})
export class TceApiModule {}

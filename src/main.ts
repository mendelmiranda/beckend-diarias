import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient } from '@prisma/client';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import * as fs from 'fs';

async function bootstrap() {
  const prisma = new PrismaClient();
  
  const app = await NestFactory.create(
    AppModule,
    new FastifyAdapter()
  );

  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://s3i.tce.ap.gov.br',
      'http://10.10.0.18:8084',
      'http://192.168.210.71:3000',  
      'http://10.10.5.210:3000',    
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  if (process.env.NODE_ENV === 'PROD') {
    const root = '/home/deployer/sslfiles';
    const httpsOptions = () => ({
      key: fs.readFileSync(`${root}/tce.ap.gov.br.key`),
      cert: fs.readFileSync(`${root}/STAR_tce_ap_gov_br.crt`),
      ca: [fs.readFileSync(`${root}/CER - CRT Files/SectigoRSADomainValidationSecureServerCA.crt`)],
    });

    await app.listen(4000, '0.0.0.0', httpsOptions);
  } else {
    await app.listen(4000);
  }

  await prisma.$disconnect();
}

bootstrap();
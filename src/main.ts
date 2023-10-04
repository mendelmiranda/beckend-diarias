import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient, prisma } from '@prisma/client';
import {
  FastifyAdapter,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const prisma = new PrismaClient();

  const root = '/home/deployer/sslfiles';
  const https = require('https');
  const fs = require('fs');
  const { parse } = require('url');

  const httpsOptions = {
    key: fs.readFileSync(`${root}/tce.ap.gov.br.key`),
    cert: fs.readFileSync(`${root}/STAR_tce_ap_gov_br.crt`),
    ca: [fs.readFileSync(`${root}/CER - CRT Files/SectigoRSADomainValidationSecureServerCA.crt`)],
  };

  const app = await NestFactory.create(AppModule, {
    //httpsOptions,
});

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app
    .listen(4000)
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
    });

}
bootstrap();

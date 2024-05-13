import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient, prisma } from '@prisma/client';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const prisma = new PrismaClient();
  const fs = require('fs');

  /*COLOCAR ESSE COMENTADO EM PRODUÇÃO
 const root = '/home/deployer/sslfiles';
 const httpsOptions = {
    key: fs.readFileSync(`${root}/tce.ap.gov.br.key`),
    cert: fs.readFileSync(`${root}/STAR_tce_ap_gov_br.crt`),
    ca: [fs.readFileSync(`${root}/CER - CRT Files/SectigoRSADomainValidationSecureServerCA.crt`)],
  };
  */

  const app = await NestFactory.create(AppModule, {
    //httpsOptions,
  });

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

  const config = new DocumentBuilder()
    .setTitle('API de Solicitação de Viagens e Diárias')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

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

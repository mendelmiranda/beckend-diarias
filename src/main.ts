// main.ts - Configuração CORS mais robusta
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';

async function bootstrap() {
  const prisma = new PrismaClient();
  
  /*COLOCAR ESSE COMENTADO EM PRODUÇÃO
  const fs = require('fs');  
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


  // Configuração CORS mais robusta
  app.enableCors({
    origin: [
      'http://localhost:4321',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3004',
      'http://localhost:5173',
      'https://s3i.tce.ap.gov.br',
      'https://10.10.22.16',
      'http://10.10.0.18:8084',
      'http://192.168.210.71:3000',
      'http://10.10.5.210:3000',
      'http://10.10.3.5:3000',
      'http://10.10.0.18:3004',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });


  // REMOVER ValidationPipe por enquanto para evitar erro
  // Só adicionar depois de instalar class-transformer
  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true,
  //   transform: true,
  // }));

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API de Solicitação de Viagens e Diárias')
    .setDescription('API')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
  console.log('🚀 Server running on http://localhost:4000');
}

bootstrap().catch(console.error);
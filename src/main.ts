import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaClient, prisma } from '@prisma/client';

async function bootstrap() {
  const prisma = new PrismaClient()
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
  });

  await app.listen(4000).then(async () => {
    await prisma.$disconnect();
  }).catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
}
bootstrap();

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const POSTGRES_HOST = configService.get('POSTGRES_HOST');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.listen(port);

  console.log('listened at: ', port);
  console.log('DB HOST: ', POSTGRES_HOST);
}
bootstrap();

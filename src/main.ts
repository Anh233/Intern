import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = app.get(ConfigService).get<number>('app.port') || 3000;
  setupSwagger(app);
  await app.listen(port);
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('PA Intern')
    .setDescription('API description')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/documentation', app, document);
}

bootstrap();

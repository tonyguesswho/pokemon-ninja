import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { corsConfig } from '../src/config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  const logger = new Logger('Bootstrap');
  const config = new DocumentBuilder()
    .setTitle('Pokémon API')
    .setDescription('The Pokémon API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('pokemon')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new HttpExceptionFilter());
  const configService = app.get(ConfigService);
  app.enableCors(corsConfig);
  await app.listen(configService.get<number>('PORT', 3000));

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();

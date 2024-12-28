import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger')
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Auto re-write OpenAPI local document to file for az api management
  const localDocument = {
    ...document,
    servers: [
      {
        description: `Testing API`,
      },
    ],
  };

  try {
    fs.writeFileSync('./openapi.json', JSON.stringify(localDocument, null, 2));
    console.info(`OpenAPI document written to openapi.json`);
  } catch (error) {
    console.info('Error writing OpenAPI document to file', error);
  }

  await app.listen(3000);
}
bootstrap();

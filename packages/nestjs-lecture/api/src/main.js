import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

const app = await NestFactory.create(AppModule);
app.enableCors({ origin: process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:4170' });
app.enableShutdownHooks();
await app.listen(Number(process.env.PORT || 3000), '127.0.0.1');

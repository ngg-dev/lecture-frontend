import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module.js';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookshop', {
      serverSelectionTimeoutMS: 5000, retryAttempts: 0
    }),
    BooksModule
  ]
})
export class AppModule {}

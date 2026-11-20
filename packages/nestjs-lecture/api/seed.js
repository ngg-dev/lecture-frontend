import mongoose from 'mongoose';
import { BookSchema } from './src/books/book.schema.js';
import { initialBooks } from '../src/books.js';
try {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bookshop', { serverSelectionTimeoutMS: 5000 });
  const Book = mongoose.model('Book', BookSchema);
  for (const { id, title, author, category, price } of initialBooks) {
    // Повторный запуск добавляет отсутствующие книги, сохраняя уже изменённые цены.
    await Book.updateOne({ _id: id }, { $setOnInsert: { title, author, category, price } }, { upsert: true });
  }
  console.log('Четыре книги подготовлены. Существующие цены сохранены.');
} finally { await mongoose.disconnect(); }

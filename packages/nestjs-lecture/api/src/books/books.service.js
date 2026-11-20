import { BadRequestException, Dependencies, Injectable, NotFoundException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { isValidPrice, toBookDto } from './price.js';

@Injectable()
@Dependencies(getModelToken('Book'))
export class BooksService {
  constructor(bookModel) { this.books = bookModel; }

  async findAll(author, category) {
    const filter = {};
    // Только ожидаемые строки; объект фильтра никогда не берём из body/query целиком.
    if (author !== undefined) {
      if (typeof author !== 'string') throw new BadRequestException('author должен быть строкой');
      filter.author = author;
    }
    if (category !== undefined) {
      if (typeof category !== 'string') throw new BadRequestException('category должна быть строкой');
      filter.category = category;
    }
    const books = await this.books.find(filter).lean().exec();
    return books.map(toBookDto);
  }

  checkId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) throw new BadRequestException('Некорректный id');
  }

  async findOne(id) {
    this.checkId(id);
    const book = await this.books.findById(id).lean().exec();
    if (!book) throw new NotFoundException('Книга не найдена');
    return toBookDto(book);
  }

  async updatePrice(id, body) {
    this.checkId(id);
    if (!body || !isValidPrice(body.price)) {
      throw new BadRequestException('Цена должна быть конечным неотрицательным числом');
    }
    const book = await this.books.findByIdAndUpdate(id,
      { $set: { price: body.price } }, { new: true, runValidators: true }).lean().exec();
    if (!book) throw new NotFoundException('Книга не найдена');
    return toBookDto(book);
  }
}

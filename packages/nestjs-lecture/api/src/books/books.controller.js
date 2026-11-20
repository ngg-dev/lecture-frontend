import { Bind, Body, Controller, Dependencies, Get, Param, Patch, Query } from '@nestjs/common';
import { BooksService } from './books.service.js';

@Controller('books')
@Dependencies(BooksService)
export class BooksController {
  constructor(booksService) { this.books = booksService; }

  @Get()
  @Bind(Query('author'), Query('category'))
  findAll(author, category) {
    return this.books.findAll(author, category);
  }

  @Get(':id')
  @Bind(Param('id'))
  findOne(id) { return this.books.findOne(id); }

  @Patch(':id')
  @Bind(Param('id'), Body())
  updatePrice(id, body) {
    return this.books.updatePrice(id, body);
  }
}

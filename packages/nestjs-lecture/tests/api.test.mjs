import 'reflect-metadata';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { BooksController } from '../api/dist/books/books.controller.js';
import { BooksService } from '../api/dist/books/books.service.js';
import mongoose from 'mongoose';
import { BookSchema } from '../api/dist/books/book.schema.js';
import { isValidPrice, toBookDto } from '../api/dist/books/price.js';

test('price contract accepts zero and rejects coercion, negatives and nonfinite values',()=>{
  for(const value of [0,690,1.5])assert(isValidPrice(value));
  for(const value of [-1,'690','',null,undefined,NaN,Infinity,{},[]])assert(!isValidPrice(value));
});
test('DTO has a string id and exposes only public book fields',()=>{
  const dto=toBookDto({_id:'abc',title:'Book',author:'Author',category:'Prose',price:10,secret:'hidden',__v:2});
  assert.deepEqual(dto,{id:'abc',title:'Book',author:'Author',category:'Prose',price:10});
});

test('Mongoose schema requires book fields and rejects a negative stored price',()=>{
  const Book=mongoose.models.LectureSchemaTest || mongoose.model('LectureSchemaTest',BookSchema);
  const good=new Book({title:'Book',author:'Author',category:'Classic',price:0});
  assert.equal(good.validateSync(),undefined);
  assert(new Book({title:'Book',author:'Author',category:'Classic',price:-1}).validateSync()?.errors.price);
  assert(new Book({price:10}).validateSync()?.errors.title);
});

test('real Nest HTTP routes, DI and errors against an isolated model double',async t=>{
  // Подмена модели нужна для проверки HTTP/правил без запущенной MongoDB.
  // Это НЕ проверка реального драйвера или сохранения на диск.
  const id='64a000000000000000000001';
  let record={_id:id,title:'Book',author:'Author',category:'Classic',price:690};
  const query=result=>({lean:()=>({exec:async()=>result})});
  let lastUpdate;
  const model={
    find:filter=>query(Object.entries(filter).every(([k,v])=>record[k]===v)?[{...record}]:[]),
    findById:key=>query(key===id?{...record}:null),
    findByIdAndUpdate:(key,update,options)=>{
      lastUpdate={update,options};
      if(key!==id)return query(null);
      record={...record,...update.$set};return query({...record});
    }
  };
  class HttpTestModule {}
  Module({controllers:[BooksController],providers:[{provide:BooksService,useValue:new BooksService(model)}]})(HttpTestModule);
  const app=await NestFactory.create(HttpTestModule,{logger:false});
  app.enableCors({origin:'http://127.0.0.1:4170'});
  try {
    await app.listen(0,'127.0.0.1');
    const base=await app.getUrl();
    const request=(path,body)=>fetch(base+path,body===undefined?{}:{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    let r=await request('/books');assert.equal(r.status,200);assert.equal((await r.json())[0].id,id);
    r=await request('/books?author=Author');assert.equal((await r.json()).length,1);
    r=await request('/books?author=Missing');assert.deepEqual(await r.json(),[]);
    r=await request('/books?category=Classic');assert.equal((await r.json()).length,1);
    r=await request('/books?category=Missing');assert.deepEqual(await r.json(),[]);
    r=await request('/books?author[x]=bad');assert.equal(r.status,200); // unexpected keys ignored; no operators reach the model
    r=await request('/books?author=A&author=B');assert.equal(r.status,400);
    r=await request('/books/'+id);assert.equal(r.status,200);
    r=await request('/books/bad');assert.equal(r.status,400);
    r=await request('/books/64a000000000000000000099');assert.equal(r.status,404);
    r=await request('/books/'+id,{price:790,title:'Cannot change title'});assert.equal(r.status,200);assert.equal((await r.json()).title,'Book');
    assert.deepEqual(lastUpdate,{update:{$set:{price:790}},options:{new:true,runValidators:true}});
    r=await request('/books/'+id,{price:-1});assert.equal(r.status,400);
    r=await request('/books/'+id,{price:'790'});assert.equal(r.status,400);
    r=await request('/books/'+id,{});assert.equal(r.status,400);
    r=await request('/books/'+id);assert.equal((await r.json()).price,790);
    const cors=await fetch(base+'/books',{headers:{Origin:'http://127.0.0.1:4170'}});assert.equal(cors.headers.get('access-control-allow-origin'),'http://127.0.0.1:4170');
  } finally { await app.close(); }
});

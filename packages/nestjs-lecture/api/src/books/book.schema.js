import mongoose from 'mongoose';
export const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 }
}, { versionKey: false });

import React from 'react';
import { BookCatalog } from '../examples/BookCatalog';

export function Demo({ mode }) {
  return mode === 'project' ? <BookCatalog /> : null;
}

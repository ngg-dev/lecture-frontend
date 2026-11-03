import ts from 'typescript';
import libraries from '../.generated/libraries.json';
import { compileSource } from './compiler.js';
self.onmessage = ({ data }) => {
  try {
    self.postMessage({ id: data.id, ...compileSource(ts, libraries, data.source, data.noEmitOnError) });
  } catch (error) {
    self.postMessage({ id: data.id, error: String(error.message || error) });
  }
};

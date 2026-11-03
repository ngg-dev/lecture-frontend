import ts from 'typescript';
import { resolve } from 'node:path';
import { root } from './bundle-options.mjs';
import { reactFullSource } from '../src/react-examples.js';

export function compileReactExample(snippet) {
  const entry = resolve(root, 'examples/__slide__.tsx');
  const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, strict: true, noUncheckedIndexedAccess: true, noEmit: true, skipLibCheck: true };
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) => file === entry
    ? ts.createSourceFile(entry, reactFullSource(snippet), languageVersion, true, ts.ScriptKind.TSX)
    : getSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile);
  const program = ts.createProgram([entry], options, host);
  return { diagnostics: ts.getPreEmitDiagnostics(program).filter(item => item.category === ts.DiagnosticCategory.Error).map(item => {
    const position = item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start) : null;
    return { code: item.code, line: position ? position.line + 1 : null, character: position ? position.character + 1 : null, length: item.length || 1, message: ts.flattenDiagnosticMessageText(item.messageText, '\n') };
  }) };
}

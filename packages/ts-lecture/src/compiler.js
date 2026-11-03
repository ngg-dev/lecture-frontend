// Shared by the real browser worker and Node verification.
export function compileSource(ts, libraries, source, noEmitOnError = false) {
  const entry = '/lesson.ts';
  const files = { ...libraries, [entry]: source };
  const output = {};
  const options = {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    strict: true,
    noUncheckedIndexedAccess: true,
    noEmitOnError,
    skipLibCheck: true,
    lib: ['lib.es2022.full.d.ts']
  };
  const normalize = file => '/' + file.replaceAll('\\', '/').split('/').pop();
  const host = {
    getSourceFile: (file, languageVersion) => {
      const text = files[normalize(file)];
      return text === undefined ? undefined : ts.createSourceFile(file, text, languageVersion, true);
    },
    getDefaultLibFileName: () => '/lib.es2022.full.d.ts',
    writeFile: (file, text) => { output[file] = text; },
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    fileExists: file => Object.hasOwn(files, normalize(file)),
    readFile: file => files[normalize(file)],
    getCanonicalFileName: file => file,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n'
  };
  const program = ts.createProgram([entry], options, host);
  const diagnostics = ts.getPreEmitDiagnostics(program)
    .filter(item => item.category === ts.DiagnosticCategory.Error)
    .map(item => {
      const position = item.file && item.start !== undefined ? item.file.getLineAndCharacterOfPosition(item.start) : null;
      return {
        code: item.code,
        line: position ? position.line + 1 : null,
        character: position ? position.character + 1 : null,
        length: item.length || 1,
        message: ts.flattenDiagnosticMessageText(item.messageText, '\n')
      };
    });
  const result = program.emit();
  return { diagnostics, javascript: output['/lesson.js'] || '', emitSkipped: result.emitSkipped, version: ts.version };
}

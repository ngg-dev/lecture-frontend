export function snippetDiagnostics(snippet, result) {
  const offset = snippet.context ? snippet.context.split('\n').length + 1 : 0;
  return result.diagnostics.map(item => ({ ...item, line: item.line === null ? null : item.line - offset }));
}

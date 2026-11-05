export function parsePrice(draft: string): number | null {
  if (draft.trim() === '') return null;
  const value = Number(draft);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

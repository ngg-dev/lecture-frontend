import { useId, useState, type FormEvent } from 'react';
import { parsePrice } from './model';

export function PriceEditor({ price, onSave }: { price: number; onSave: (price: number) => Promise<void> }) {
  const id = useId();
  const [draft, setDraft] = useState(String(price));
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving) return;
    setStatus('');
    setError('');
    const value = parsePrice(draft);
    if (value === null) { setError('Введите неотрицательное число'); return; }
    setSaving(true);
    try { await onSave(value); setStatus('Цена сохранена'); }
    catch { setError('Не удалось сохранить. Попробуйте ещё раз.'); }
    finally { setSaving(false); }
  }
  return <form onSubmit={submit}>
    <label htmlFor={id}>Новая цена</label>
    <input id={id} inputMode="decimal" value={draft} disabled={saving} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} onChange={event => setDraft(event.target.value)} />
    <button type="submit" disabled={saving}>{saving ? 'Сохраняем…' : 'Сохранить'}</button>
    {error && <p role="alert" id={`${id}-error`}>{error}</p>}
    {status && <p role="status">{status}</p>}
  </form>;
}

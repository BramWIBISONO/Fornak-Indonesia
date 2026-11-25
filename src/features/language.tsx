import { useSyncExternalStore } from 'react';
import { Languages } from 'lucide-react';
import { useState } from 'react';

export const languages = {
  id: 'Indonesia',
  en: 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文（台灣）',
} as const;

type Locale = keyof typeof languages;
const storageKey = 'fornak-language';
let translations: Record<string, string[]> = {};
let dictionaryRequest: Promise<void> | undefined;
function loadDictionary() {
  dictionaryRequest ??= import('./translations.json').then(module => { translations = module.default; }).catch(error => { dictionaryRequest = undefined; throw error; });
  return dictionaryRequest;
}
const column = { en: 0, 'zh-CN': 1, 'zh-TW': 2 };
const listeners = new Set<() => void>();

function savedLocale(): Locale {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved && Object.hasOwn(languages, saved)) return saved as Locale;
  } catch { /* Storage is optional in private browsing. */ }
  return 'id';
}

let locale: Locale = 'id';
let requestNumber = 0;
document.documentElement.lang = locale;

async function setLocale(next: Locale) {
  const number = ++requestNumber;
  if (next !== 'id') await loadDictionary();
  if (number !== requestNumber || next === locale) return;
  locale = next;
  document.documentElement.lang = next;
  try { localStorage.setItem(storageKey, next); } catch { /* Keep the session preference. */ }
  listeners.forEach(notify => notify());
}

export async function restoreLocale() {
  await setLocale(savedLocale()).catch(() => undefined);
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => { listeners.delete(notify); };
}

export const useLocale = () => useSyncExternalStore(subscribe, () => locale);

export function tr(value: string): string {
  if (locale === 'id') return value;
  const translated = translations[value.trim()]?.[column[locale]];
  return translated ? value.replace(value.trim(), () => translated) : value;
}

export function LanguagePicker() {
  const current = useLocale();
  const [failed, setFailed] = useState(false);
  return (
    <label className="locale-control">
      <Languages size={18} aria-hidden="true"/>
      <select aria-label="Bahasa / Language / 语言 / 語言" value={current}
        onFocus={() => { void loadDictionary().catch(() => undefined); }}
        onChange={event => { setFailed(false); void setLocale(event.target.value as Locale).catch(() => setFailed(true)); }}>
        {Object.entries(languages).map(([code, name]) =>
          <option key={code} value={code} lang={code}>{name}</option>
        )}
      </select>
      {failed && <span role="alert">Terjemahan gagal dimuat. Silakan pilih bahasa kembali.</span>}
    </label>
  );
}

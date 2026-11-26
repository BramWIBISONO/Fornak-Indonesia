import { useSyncExternalStore } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { LocaleFlag } from './LocaleFlag';
import indonesia from './editions/id.json';
let edition: Record<string,string> = indonesia;
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
  const nextEdition = next==='id' ? indonesia : (await Promise.all([import(`./editions/${next}.json`),loadDictionary()]))[0].default;
  if (number !== requestNumber || next === locale) return;
  edition = nextEdition;
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
  if (locale === 'id') return edition[value.trim()] ?? value;
  const translated = translations[value.trim()]?.[column[locale]] ?? edition[value.trim()];
  return translated ? value.replace(value.trim(), () => translated) : value;
}

export function LanguagePicker() {
  const current = useLocale();
  const [open,setOpen] = useState(false);
  const [failed,setFailed] = useState(false);
  const holder = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(()=>{
    if(!open) return;
    holder.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]')?.focus();
    const dismiss = (event:PointerEvent) => { if(!holder.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown',dismiss);
    return ()=>document.removeEventListener('pointerdown',dismiss);
  },[open]);
  function close() {setOpen(false);trigger.current?.focus();}
  return <div className="language-menu" ref={holder} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
    <button ref={trigger} type="button" aria-label={'Bahasa / Language · '+languages[current]} aria-haspopup="menu" aria-controls={id} aria-expanded={open} onClick={()=>setOpen(!open)}><LocaleFlag code={current}/><span lang={current}>{languages[current]}</span><ChevronDown size={14}/></button>
    {open && <div id={id} role="menu" aria-label="Bahasa / Language" onKeyDown={event=>{
      if(event.key==='Escape'){event.preventDefault();close();return;}
      const options=Array.from(event.currentTarget.querySelectorAll('button'));
      const i=options.indexOf(document.activeElement as HTMLButtonElement);
      const next=({ArrowDown:(i+1)%4,ArrowUp:(i+3)%4,Home:0,End:3} as Record<string,number>)[event.key];
      if(next!==undefined){event.preventDefault();options[next].focus();}
    }}>{Object.entries(languages).map(([code,name])=><button type="button" key={code} lang={code} role="menuitemradio" aria-checked={current===code}
      onClick={()=>{setFailed(false);close();void setLocale(code as Locale).catch(()=>setFailed(true));}}>
      <LocaleFlag code={code}/>{name}{current===code && <Check size={15}/>}</button>)}</div>}
    {failed && <span role="alert">Terjemahan gagal dimuat. Silakan pilih bahasa kembali.</span>}
  </div>;
}

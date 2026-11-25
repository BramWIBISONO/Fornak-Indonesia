import { tr } from '../language';
import { ArrowUpRight, MessageCircle, Phone, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import './assistant.css';

type Navigate = (path: string) => void;
type Message = { role: 'assistant' | 'user'; text: string };

const adminUrl = 'https://wa.me/6289673335886?text=Halo%20Admin%20FORNAK%2C%20saya%20ingin%20bertanya%20mengenai%20FORNAK%20Indonesia.';

function answerFor(input: string) {
  const value = input.toLocaleLowerCase('id-ID');
  if (/artikel|jurnal|tulisan|journal|article|opini|文章|期刊|评论|評論/.test(value)) {
    return 'Jurnal FORNAK memuat esai dan 93 opini INN Indonesia yang dapat dibaca di situs ini.';
  }
  if (/contact|联系|聯絡|管理员|管理員/.test(value) || value.includes('kontak') || value.includes('admin') || value.includes('whatsapp')) {
    return 'Admin FORNAK dapat dihubungi melalui WhatsApp di +62 896-7333-5886. Gunakan tombol kontak di bawah agar pesan Anda langsung terarah.';
  }
  if (/mission|about|使命|关于|關於/.test(value) || value.includes('misi') || value.includes('tentang')) {
    return 'FORNAK Indonesia menyatukan, menyuarakan, dan menggerakkan WNI Kristen untuk terlibat aktif dalam pembangunan bangsa berdasarkan Pancasila, UUD 1945, dan Bhinneka Tunggal Ika.';
  }
  if (value.includes('instagram') || value.includes('ig')) {
    return 'Kanal Instagram FORNAK adalah @fornak.id. Tautannya tersedia di bagian kontak dan footer situs.';
  }
  return 'Saya dapat membantu menjelaskan FORNAK, mencari jurnal, membuka publikasi, atau menghubungkan Anda dengan admin.';
}

export function FornakAssistant({ navigate }: { navigate: Navigate }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Shalom. Saya Asisten FORNAK. Apa yang ingin Anda ketahui?' },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);

  const launcher = useRef<HTMLButtonElement>(null);
  const messagesBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open && messagesBox.current) messagesBox.current.scrollTop = messagesBox.current.scrollHeight;
  }, [messages, open]);
  const close = () => { setOpen(false); requestAnimationFrame(() => launcher.current?.focus()); };
  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [
      ...current,
      { role: 'user', text: clean },
      { role: 'assistant', text: answerFor(clean) },
    ]);
    setInput('');
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    send(input);
  };

  const openRoute = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <div className={`fornak-assistant ${open ? 'is-open' : ''}`}>
      {open && (
        <section className="assistant-panel" onKeyDown={e => { if (e.key === "Escape") close(); }} role="dialog" aria-modal="false" aria-label={tr("Asisten FORNAK")}>
          <header>
            <div>
              <span className="assistant-kicker">{tr("Informasi organisasi")}</span>
              <strong>{tr("Asisten FORNAK")}</strong>
            </div>
            <button type="button" onClick={close} aria-label={tr("Tutup asisten")}><X /></button>
          </header>
          <div tabIndex={0} role="log" aria-label={tr("Percakapan asisten")} ref={messagesBox} className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <p key={`${message.role}-${index}`} className={message.role}>{message.role==='assistant' || message.text==='Apa misi FORNAK?' ? tr(message.text) : message.text}</p>
            ))}
          </div>
          <div className="assistant-quick">
            <button type="button" onClick={() => send('Apa misi FORNAK?')}>{tr("Misi FORNAK")}</button>
            <button type="button" onClick={() => openRoute('/jurnal')}>{tr("Buka jurnal")}</button>
            <button type="button" onClick={() => openRoute('/publikasi')}>{tr("Publikasi")}</button>
          </div>
          <form onSubmit={onSubmit}>
            <label htmlFor="assistant-input" className="sr-only">{tr("Tulis pertanyaan")}</label>
            <input
              ref={inputRef}
              id="assistant-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={tr("Tulis pertanyaan…")}
            />
            <button type="submit">{tr("Kirim")}</button>
          </form>
          <footer>
            <span>{tr("Butuh bantuan langsung?")}</span>
            <a href={adminUrl} target="_blank" rel="noreferrer" className="assistant-admin">
              <Phone aria-hidden="true" /> {tr("Admin FORNAK")} <ArrowUpRight aria-hidden="true" />
            </a>
          </footer>
        </section>
      )}
      <button
        type="button"
        ref={launcher} className="assistant-toggle"
        aria-label={tr(open ? 'Tutup Asisten FORNAK' : 'Buka Asisten FORNAK')}
        aria-expanded={open}
        onClick={() => { setOpen((value) => !value); window.setTimeout(() => inputRef.current?.focus(), 80); }}
      >
        {open ? <X aria-hidden="true" /> : <MessageCircle aria-hidden="true" />}
        <span>{tr(open ? 'Tutup panel' : 'Tanya FORNAK')}</span>
      </button>
    </div>
  );
}

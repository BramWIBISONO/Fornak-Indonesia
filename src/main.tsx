import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { restoreLocale } from './features/language';
import './premium.css';
import './features/experience/red-edition.css';
import './features/chatbot/assistant.css';
import './features/journal/journal.css';
import './features/experience/folio.css';
import './features/experience/reading-room.css';

void restoreLocale().then(() => createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
));

import './features/experience/reader-controls.css';

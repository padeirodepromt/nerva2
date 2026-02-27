/* canvas: src/main.jsx
   desc: Entry Point com CSS global + animações dos ícones.
*/
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { OllyProvider } from '@/contexts/OllyContext';

// CSS global do PRANA
import './index.css';
// CSS das animações/estilo dos ícones Landscape
import './styles/prana-landscape-icons.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OllyProvider>
      <App />
    </OllyProvider>
  </React.StrictMode>
);

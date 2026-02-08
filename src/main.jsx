import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/index.css';
import './css/App.css';
import App from './App.jsx';
import 'antd/dist/reset.css';

// проверка поддержки Web Speech API
if (typeof window.speechSynthesis === 'undefined' || !('onvoiceschanged' in window.speechSynthesis)) {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 20%;
    font-size: 16px;
    width: 100%;
    height: 100%;
    color: #eee;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #141414;
    z-index: 10000;
    text-align: center;
    line-height: 1.5;
  `;
  container.innerHTML = `
    ⚠️ Ваш браузер слишком старый и <span style="color:#c85858">не поддерживает необходимые функции.</span><br/>
    Пожалуйста, откройте приложение в новых версиях браузера (например, в <span style="color:#49c6c6"><b>Yandex Browser</b></span>).
  `;
  document.body.appendChild(container);
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
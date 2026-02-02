import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import liff from '@line/liff'
import './index.css'
import App from './App.jsx'

// LIFF初期化
liff
  .init({
    liffId: '2008935592-LTkwDcg3', // 開発用LIFF ID
  })
  .then(() => {
    console.log('LIFF init succeeded');
  })
  .catch((e) => {
    console.error('LIFF init failed', e);
  });

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

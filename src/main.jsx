import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MrzScanner from './MrzScanner.jsx';

function Root() {
  const [mode, setMode] = useState('app'); // 'app' or 'mrz'
  return (
    <StrictMode>
      <div style={{ position: 'fixed', top: 16, left: 16, zIndex: 2000 }}>
        <button
          onClick={() => setMode('app')}
          style={{ marginRight: 8, padding: '8px 18px', borderRadius: 6, border: '1.5px solid #e2e8f0', background: mode === 'app' ? '#2563eb' : '#f1f5f9', color: mode === 'app' ? '#fff' : '#222', fontWeight: 600, cursor: 'pointer' }}
        >
          Main App
        </button>
        <button
          onClick={() => setMode('mrz')}
          style={{ padding: '8px 18px', borderRadius: 6, border: '1.5px solid #e2e8f0', background: mode === 'mrz' ? '#2563eb' : '#f1f5f9', color: mode === 'mrz' ? '#fff' : '#222', fontWeight: 600, cursor: 'pointer' }}
        >
          MRZ Scanner
        </button>
      </div>
      {mode === 'app' ? <App /> : <MrzScanner />}
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);

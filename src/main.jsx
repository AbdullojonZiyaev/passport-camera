import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

function Root() {
  const [mode, setMode] = useState('app'); // 'app' or 'mrz'
  return (
    <StrictMode>
       <App /> 
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);

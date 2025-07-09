import { downloadImage } from '../utils/helpers.js';

export const ResultModal = ({ apiResult, photo, onClose }) => {
  if (!apiResult) return null;

  const handleDownload = () => {
    downloadImage(photo, 'successful-frame');
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      background: 'rgba(0,0,0,0.25)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: 16, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)', 
        padding: 32, 
        minWidth: 320, 
        maxWidth: '95vw', 
        maxHeight: '80vh', 
        overflowY: 'auto', 
        display: 'inline-block', 
        flexDirection: 'column', 
        alignItems: 'center', 
        position: 'relative', 
        width: 'auto', 
        whiteSpace: 'pre' 
      }}>
        <button 
          onClick={onClose} 
          style={{ 
            position: 'absolute', 
            top: 16, 
            right: 16, 
            background: 'none', 
            border: 'none', 
            fontSize: 28, 
            color: '#888', 
            cursor: 'pointer' 
          }}
        >
          &times;
        </button>
        
        <h3 style={{ 
          marginBottom: 18, 
          color: '#2563eb', 
          fontWeight: 700, 
          fontSize: 22 
        }}>
          MRZ Info
        </h3>
        
        <pre style={{ 
          background: '#f1f5f9', 
          padding: 16, 
          borderRadius: 8, 
          textAlign: 'left', 
          fontSize: 15, 
          border: '1.5px solid #e2e8f0', 
          color: '#222', 
          width: 'auto', 
          minWidth: 200 
        }}>
          {apiResult}
        </pre>
        
        {photo && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <p style={{ marginBottom: 8, color: '#666', fontSize: 14 }}>
              Successful frame:
            </p>
            <img 
              src={photo} 
              alt="Successful frame" 
              style={{ 
                maxWidth: 200, 
                maxHeight: 150, 
                borderRadius: 8, 
                border: '1px solid #e2e8f0', 
                marginBottom: 8 
              }} 
            />
            <br />
            <button 
              onClick={handleDownload} 
              style={{ 
                padding: '8px 16px', 
                borderRadius: 6, 
                border: '1px solid #2563eb', 
                background: '#2563eb', 
                color: '#fff', 
                fontSize: 14, 
                cursor: 'pointer' 
              }}
            >
              Download Frame
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

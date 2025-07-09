import cameraIcon from '../assets/camera.svg';

export const StartScreen = ({ onCameraClick }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: 24 
    }}>
      <button 
        onClick={onCameraClick} 
        style={{ 
          width: 140, 
          height: 140, 
          borderRadius: '50%', 
          border: '2px solid #e2e8f0', 
          background: '#fff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', 
          cursor: 'pointer' 
        }}
      >
        <img 
          src={cameraIcon} 
          alt="Camera" 
          style={{ 
            width: 72, 
            height: 72, 
            filter: 'invert(0.2)' 
          }} 
        />
      </button>
      
      <p style={{
        color: '#666',
        fontSize: 16,
        textAlign: 'center',
        margin: 0,
        fontWeight: 500
      }}>
        Tap to scan passport with camera
      </p>
    </div>
  );
};

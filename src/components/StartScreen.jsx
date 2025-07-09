import cameraIcon from '../assets/camera.svg';

export const StartScreen = ({ onCameraClick, onFileSelect }) => {
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
      
      <button 
        onClick={onFileSelect} 
        style={{ 
          padding: '12px 32px', 
          borderRadius: 8, 
          border: '1.5px solid #e2e8f0', 
          background: '#f1f5f9', 
          color: '#222', 
          fontWeight: 600, 
          fontSize: 18, 
          cursor: 'pointer', 
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)' 
        }}
      >
        Choose File
      </button>
    </div>
  );
};

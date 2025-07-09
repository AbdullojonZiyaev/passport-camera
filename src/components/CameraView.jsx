import { CameraOverlay } from './CameraOverlay.jsx';
import { ValidationFeedback } from './ValidationFeedback.jsx';

export const CameraView = ({ videoRef, canvasRef, validationFeedback, isCapturing, onCancel }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      width: '80vw', 
      height: '70vh', 
      maxWidth: 900, 
      maxHeight: 600, 
      justifyContent: 'center', 
      background: '#fff', 
      borderRadius: 16, 
      border: '1.5px solid #e2e8f0', 
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)' 
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <video 
          ref={videoRef} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            borderRadius: 16, 
            background: '#e2e8f0' 
          }} 
          autoPlay 
          playsInline 
          muted 
        />
        
        <canvas 
          ref={canvasRef} 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none', 
            borderRadius: 16 
          }} 
        />
        
        <CameraOverlay 
          isCapturing={isCapturing}
          validationFeedback={validationFeedback}
          videoRef={videoRef}
          canvasRef={canvasRef}
        />
        
        <ValidationFeedback validationFeedback={validationFeedback} />
      </div>
      
      <div style={{ 
        marginTop: 18, 
        display: 'flex', 
        gap: 18, 
        justifyContent: 'center' 
      }}>
        <button 
          onClick={onCancel} 
          style={{ 
            padding: '14px 32px', 
            borderRadius: 8, 
            border: 'none', 
            background: '#e2e8f0', 
            color: '#222', 
            fontWeight: 600, 
            fontSize: 18, 
            cursor: 'pointer', 
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)' 
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

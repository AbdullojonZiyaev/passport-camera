import './App.css';
import { useCameraCapture } from './hooks/useCameraCapture.js';
import { StartScreen } from './components/StartScreen.jsx';
import { CameraView } from './components/CameraView.jsx';
import { PhotoPreview } from './components/PhotoPreview.jsx';
import { ResultModal } from './components/ResultModal.jsx';

function App() {
  const {
    isCapturing,
    validationFeedback,
    apiResult,
    error,
    photo,
    videoRef,
    canvasRef,
    startCapture,
    cancelCapture,
    closeResult,
    setPhoto,
    setApiResult
  } = useCameraCapture();

  const handleRetake = () => {
    setPhoto(null);
    setApiResult(null);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      width: '100vw', 
      background: '#fff', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0 
    }}>
      {!isCapturing && !photo && (
        <StartScreen 
          onCameraClick={startCapture}
        />
      )}

      {isCapturing && (
        <CameraView 
          videoRef={videoRef}
          canvasRef={canvasRef}
          validationFeedback={validationFeedback}
          isCapturing={isCapturing}
          onCancel={cancelCapture}
        />
      )}

      {photo && !apiResult && (
        <PhotoPreview 
          photo={photo}
          onRetake={handleRetake}
        />
      )}

      {error && (
        <div style={{ 
          color: '#e11d48', 
          marginTop: 14, 
          position: 'absolute', 
          top: 24 
        }}>
          {error}
        </div>
      )}

      <ResultModal 
        apiResult={apiResult}
        photo={photo}
        onClose={closeResult}
      />
    </div>
  );
}

export default App;

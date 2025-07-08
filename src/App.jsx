import { useEffect, useRef, useState } from 'react';
import cameraIcon from './assets/camera.svg';
import './App.css';

function App() {
  const [photo, setPhoto] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef();
  const canvasRef = useRef();
  const fileInputRef = useRef();
  const streamIntervalRef = useRef();

  const dataURLtoBlob = (dataUrl) => {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  };

  const stopStreaming = () => {
    setIsStreaming(false);
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleButtonClick = async () => {
    setError(null);
    setApiResult(null);
    setPhoto(null);
    setIsCapturing(true);

    // Prompt user for camera permission as soon as possible
    try {
      // Try to request camera permission explicitly (if supported)
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // This will trigger the browser's permission dialog
        await navigator.mediaDevices.getUserMedia({ video: true });
      }
    } catch (err) {
      setError('Camera access denied or not available. Make sure browser has permission and is served over HTTPS.');
      setIsCapturing(false);
      return;
    }

    try {
      // Optional: Check if permission was already granted/denied
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'camera' });
        if (result.state === 'denied') {
          setError('Camera access denied in browser settings.');
          setIsCapturing(false);
          return;
        }
      }

      // Request camera stream with environment facing if possible
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        videoRef.current.onloadedmetadata = () => {
          startStreaming();
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied or not available. Make sure browser has permission and is served over HTTPS.');
      setIsCapturing(false);
    }
  };


  const startStreaming = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsStreaming(true);

    streamIntervalRef.current = setInterval(async () => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const blob = dataURLtoBlob(dataUrl);
        const formData = new FormData();
        formData.append('file', blob, 'frame.jpg');

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('http://10.231.58.10:8000/read-mrz/', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        const text = await response.text();
        if (response.ok && text) {
          try {
            const data = JSON.parse(text);
            setApiResult(JSON.stringify(data, null, 2));
            stopStreaming();
          } catch {
            // Not valid JSON, continue
          }
        }
      } catch (err) {
        console.log('Frame processing error:', err.message || err);
      }
    }, 1000); // every 1s
  };

  const handleFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
    setIsCapturing(false);

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      const response = await fetch('http://10.231.58.10:8000/read-mrz/', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      if (!response.ok) {
        let msg = 'Error reading MRZ';
        try {
          const err = JSON.parse(text);
          msg = err.detail || msg;
        } catch {}
        setApiResult(msg);
      } else if (!text) {
        setApiResult('API returned 200 OK but response was empty.');
      } else {
        try {
          const data = JSON.parse(text);
          setApiResult(JSON.stringify(data, null, 2));
        } catch {
          setApiResult('API returned 200 OK but response was not valid JSON.');
        }
      }
    } catch (err) {
      setApiResult('Network error or CORS issue: could not send photo to API');
    }
  };

  const handleCancel = () => {
    setIsCapturing(false);
    setError(null);
    stopStreaming();
  };

  const handleCloseModal = () => {
    setApiResult(null);
    setPhoto(null);
  };

  useEffect(() => {
    if (!isCapturing || !videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    let animId;

    const drawOverlay = () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animId = requestAnimationFrame(drawOverlay);
        return;
      }

      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const margin = 32;
      const boxWidth = canvas.width - margin * 2;
      const boxHeight = boxWidth / 1.42;
      const boxX = margin;
      const boxY = (canvas.height - boxHeight) / 2;

      ctx.strokeStyle = apiResult ? 'limegreen' : '#e11d48';
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      animId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
    return () => cancelAnimationFrame(animId);
  }, [isCapturing, apiResult]);

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

      {!isCapturing && !photo && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <button onClick={handleButtonClick} style={{ width: 140, height: 140, borderRadius: '50%', border: '2px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
            <img src={cameraIcon} alt="Camera" style={{ width: 72, height: 72, filter: 'invert(0.2)' }} />
          </button>
          <button onClick={handleFileInput} style={{ padding: '12px 32px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#f1f5f9', color: '#222', fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            Choose File
          </button>
        </div>
      )}

      {isCapturing && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80vw', height: '70vh', maxWidth: 900, maxHeight: 600, justifyContent: 'center', background: '#fff', borderRadius: 16, border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 16, background: '#e2e8f0' }} autoPlay playsInline muted />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', borderRadius: 16 }} />
          </div>
          <div style={{ marginTop: 18, display: 'flex', gap: 18, justifyContent: 'center' }}>
            <button onClick={handleCancel} style={{ padding: '14px 32px', borderRadius: 8, border: 'none', background: '#e2e8f0', color: '#222', fontWeight: 600, fontSize: 18, cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>Cancel</button>
          </div>
        </div>
      )}

      {photo && !apiResult && (
        <div style={{ textAlign: 'center' }}>
          <img src={photo} alt="Captured" style={{ maxWidth: 400, maxHeight: 300, borderRadius: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1.5px solid #e2e8f0', background: '#fff' }} />
          <div style={{ marginTop: 14 }}>
            <button onClick={() => { setPhoto(null); setApiResult(null); }} style={{ padding: '10px 24px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>Retake</button>
          </div>
        </div>
      )}

      {error && <div style={{ color: '#e11d48', marginTop: 14, position: 'absolute', top: 24 }}>{error}</div>}

      {apiResult && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', padding: 32, minWidth: 320, maxWidth: '95vw', maxHeight: '80vh', overflowY: 'auto', display: 'inline-block', flexDirection: 'column', alignItems: 'center', position: 'relative', width: 'auto', whiteSpace: 'pre' }}>
            <button onClick={handleCloseModal} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 28, color: '#888', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ marginBottom: 18, color: '#2563eb', fontWeight: 700, fontSize: 22 }}>MRZ Info</h3>
            <pre style={{ background: '#f1f5f9', padding: 16, borderRadius: 8, textAlign: 'left', fontSize: 15, border: '1.5px solid #e2e8f0', color: '#222', width: 'auto', minWidth: 200 }}>{apiResult}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

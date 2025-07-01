import React, { useEffect, useRef, useState } from 'react';

const MrzScanner = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // for overlay
  const hiddenCanvasRef = useRef(null); // for sending frame
  const [result, setResult] = useState('🔍 Waiting for MRZ recognition...');
  const [bbox, setBbox] = useState(null);

  useEffect(() => {
    // Start camera
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(err => alert('Camera access error: ' + err));

    const interval = setInterval(captureAndSendFrame, 2000);
    return () => clearInterval(interval);
  }, []);

  const drawOverlay = (ctx, width, height, bbox) => {
    ctx.clearRect(0, 0, width, height);
    // Placement rectangle for passport
    const placementHeight = 80;
    const placementY = height - placementHeight - 20;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, placementY, width - 40, placementHeight);
    // Highlight MRZ if present
    if (bbox) {
      ctx.strokeStyle = 'limegreen';
      ctx.lineWidth = 3;
      ctx.strokeRect(bbox.x, bbox.y, bbox.width, bbox.height);
    }
  };

  const captureAndSendFrame = async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;
    const width = video.videoWidth;
    const height = video.videoHeight;
    const canvas = hiddenCanvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'frame.jpg');
      try {
        const res = await fetch('http://localhost:8000/parse-mrz', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.mrz_raw) setResult(data.mrz_raw);
        else setResult('MRZ not recognized');
        setBbox(data.bbox || null);
      } catch (err) {
        setResult('Request error: ' + err.message);
      }
    }, 'image/jpeg');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const drawLoop = () => {
      if (!canvas || !video) return;
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      drawOverlay(ctx, canvas.width, canvas.height, bbox);
      requestAnimationFrame(drawLoop);
    };
    drawLoop();
  }, [bbox]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>📸 MRZ Scanner (Live, React)</h2>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxWidth: 480 }} />
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      </div>
      <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
      <div style={{ marginTop: 20, background: '#f0f0f0', padding: 10, whiteSpace: 'pre-wrap', borderRadius: 8 }}>
        {result}
      </div>
    </div>
  );
};

export default MrzScanner;

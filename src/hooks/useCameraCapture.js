import { useRef, useState, useCallback } from 'react';

export const useCameraCapture = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [validationFeedback, setValidationFeedback] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState(null);

  const videoRef = useRef();
  const canvasRef = useRef();
  const streamIntervalRef = useRef();

  const dataURLtoBlob = useCallback((dataUrl) => {
    const [header, base64] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)[1];
    const binary = atob(base64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
    return new Blob([array], { type: mime });
  }, []);

  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    setValidationFeedback(null);
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const startStreaming = useCallback(() => {
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
        const timeout = setTimeout(() => controller.abort(), 5000);

        // First try the preview endpoint for real-time feedback
        const previewResponse = await fetch('http://localhost:8000/read-mrz-preview/', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (previewResponse.ok) {
          const previewData = await previewResponse.json();
          setValidationFeedback(previewData);

          // If quality is excellent, try the full processing
          if (previewData.status === 'excellent') {
            try {
              const fullResponse = await fetch('http://localhost:8000/read-mrz/', {
                method: 'POST',
                body: formData,
              });

              const fullText = await fullResponse.text();
              if (fullResponse.ok && fullText) {
                try {
                  const fullData = JSON.parse(fullText);
                  // Save the successful frame
                  setPhoto(dataUrl);
                  setApiResult(JSON.stringify(fullData, null, 2));
                  stopStreaming();
                } catch {
                  // Not valid JSON, continue with preview feedback
                }
              }
            } catch (fullError) {
              console.log('Full processing failed, continuing with preview');
            }
          }
        }
      } catch (err) {
        console.log('Frame processing error:', err.message || err);
        setValidationFeedback({
          valid_score: 0,
          validation_percentage: 0,
          status: 'error',
          message: 'Connection error'
        });
      }
    }, 500); // Check every 500ms for faster feedback
  }, [dataURLtoBlob, stopStreaming]);

  const startCapture = useCallback(async () => {
    setError(null);
    setApiResult(null);
    setPhoto(null);
    setValidationFeedback(null);
    setIsCapturing(true);

    // Prompt user for camera permission as soon as possible
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ video: true });
      }
    } catch (err) {
      setError('Camera access denied or not available. Make sure browser has permission and is served over HTTPS.');
      setIsCapturing(false);
      return;
    }

    try {
      if (navigator.permissions) {
        const result = await navigator.permissions.query({ name: 'camera' });
        if (result.state === 'denied') {
          setError('Camera access denied in browser settings.');
          setIsCapturing(false);
          return;
        }
      }

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
  }, [startStreaming]);

  const cancelCapture = useCallback(() => {
    setIsCapturing(false);
    setError(null);
    stopStreaming();
  }, [stopStreaming]);

  const closeResult = useCallback(() => {
    setApiResult(null);
    setPhoto(null);
  }, []);

  return {
    // State
    isCapturing,
    isStreaming,
    validationFeedback,
    apiResult,
    error,
    photo,
    
    // Refs
    videoRef,
    canvasRef,
    
    // Actions
    startCapture,
    cancelCapture,
    closeResult,
    setPhoto,
    setApiResult
  };
};

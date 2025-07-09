import { useEffect } from 'react';
import { getStatusColor } from '../utils/helpers.js';

export const CameraOverlay = ({ isCapturing, validationFeedback, videoRef, canvasRef }) => {
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

      // MRZ typically occupies bottom 20% of the image
      const boxMarginX = canvas.width * 0.05; // small margin on left/right
      const boxWidth = canvas.width - 2 * boxMarginX;
      const boxHeight = canvas.height * 0.20; // 20% of height
      const boxX = boxMarginX;
      const boxY = canvas.height - boxHeight - 20; // 20px padding from bottom

      // Dynamic color based on validation feedback
      const color = validationFeedback ? getStatusColor(validationFeedback.status) : '#e11d48';
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

      // Draw validation score if available
      if (validationFeedback) {
        ctx.fillStyle = color;
        ctx.font = '16px Arial';
        ctx.fillText(`Score: ${validationFeedback.valid_score}/10`, boxX, boxY - 10);
      }

      animId = requestAnimationFrame(drawOverlay);
    };

    drawOverlay();
    return () => cancelAnimationFrame(animId);
  }, [isCapturing, validationFeedback, videoRef, canvasRef]);

  return null; // This component only handles the canvas drawing
};

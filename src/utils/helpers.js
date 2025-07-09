export const getStatusColor = (status) => {
  switch (status) {
    case 'excellent': return '#10b981'; // green
    case 'good': return '#3b82f6';      // blue
    case 'fair': return '#f59e0b';      // yellow
    case 'poor': return '#ef4444';      // red
    case 'no_mrz_detected': return '#6b7280'; // gray
    default: return '#6b7280';
  }
};

export const getStatusText = (feedback) => {
  if (!feedback) return '';
  return `Score: ${feedback.valid_score}/10 (${feedback.validation_percentage}%) - ${feedback.message}`;
};

export const downloadImage = (imageDataUrl, filename = 'image') => {
  if (!imageDataUrl) return;
  const link = document.createElement('a');
  link.href = imageDataUrl;
  link.download = `${filename}-${new Date().toISOString().replace(/[:.]/g, '-')}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

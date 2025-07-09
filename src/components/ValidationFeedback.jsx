import { getStatusColor, getStatusText } from '../utils/helpers.js';

export const ValidationFeedback = ({ validationFeedback }) => {
  if (!validationFeedback) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      right: 20,
      background: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '12px 16px',
      borderRadius: 8,
      fontSize: 14,
      fontWeight: 600,
      textAlign: 'center',
      borderLeft: `4px solid ${getStatusColor(validationFeedback.status)}`
    }}>
      {getStatusText(validationFeedback)}
    </div>
  );
};

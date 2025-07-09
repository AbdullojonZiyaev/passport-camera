export const PhotoPreview = ({ photo, onRetake }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <img 
        src={photo} 
        alt="Captured" 
        style={{ 
          maxWidth: 400, 
          maxHeight: 300, 
          borderRadius: 10, 
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', 
          border: '1.5px solid #e2e8f0', 
          background: '#fff' 
        }} 
      />
      <div style={{ marginTop: 14 }}>
        <button 
          onClick={onRetake} 
          style={{ 
            padding: '10px 24px', 
            borderRadius: 8, 
            border: 'none', 
            background: '#2563eb', 
            color: '#fff', 
            fontWeight: 600, 
            fontSize: 16, 
            cursor: 'pointer' 
          }}
        >
          Retake
        </button>
      </div>
    </div>
  );
};

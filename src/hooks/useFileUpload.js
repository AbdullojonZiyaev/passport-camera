import { useRef } from 'react';
import { sendFileToAPI } from '../services/apiService.js';

export const useFileUpload = (setPhoto, setIsCapturing, setApiResult) => {
  const fileInputRef = useRef();

  const handleFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPhoto(URL.createObjectURL(file));
    setIsCapturing(false);

    const result = await sendFileToAPI(file);
    if (result.success) {
      setApiResult(result.data);
    } else {
      setApiResult(result.error);
    }
  };

  return {
    fileInputRef,
    handleFileInput,
    handleFileChange
  };
};

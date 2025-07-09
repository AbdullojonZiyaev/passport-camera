export const sendFileToAPI = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const response = await fetch('http://localhost:8000/read-mrz/', {
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
      return { success: false, error: msg };
    } else if (!text) {
      return { success: false, error: 'API returned 200 OK but response was empty.' };
    } else {
      try {
        const data = JSON.parse(text);
        return { success: true, data: JSON.stringify(data, null, 2) };
      } catch {
        return { success: false, error: 'API returned 200 OK but response was not valid JSON.' };
      }
    }
  } catch (err) {
    return { success: false, error: 'Network error or CORS issue: could not send photo to API' };
  }
};

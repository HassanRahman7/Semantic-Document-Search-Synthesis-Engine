import api from './api';

export const documentService = {
  /**
   * Uploads a PDF document
   * @param {File} file - The file to upload
   * @param {function} onUploadProgress - Callback to track upload progress percentage
   */
  uploadDocument: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onUploadProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onUploadProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  /**
   * Retrieves list of all documents
   */
  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  /**
   * Retrieves single document metadata details
   * @param {string} id - Document UUID
   */
  getDocument: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  /**
   * Deletes a document
   * @param {string} id - Document UUID
   */
  deleteDocument: async (id) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

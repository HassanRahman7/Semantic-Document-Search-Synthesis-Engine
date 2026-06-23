import api from './api';

export const searchService = {
  /**
   * Submits a question to the RAG system to generate an answer
   * @param {Object} params
   * @param {string} params.question - The natural language query
   * @param {string} [params.documentId] - Optional document UUID filter
   */
  askQuestion: async ({ question, documentId }) => {
    const response = await api.post('/search/query', {
      question,
      document_id: documentId || null,
    });
    return response.data;
  },
};

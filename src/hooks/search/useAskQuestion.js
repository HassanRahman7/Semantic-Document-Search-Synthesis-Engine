import { useMutation } from '@tanstack/react-query';
import { searchService } from '../../services/searchService';

export function useAskQuestion() {
  return useMutation({
    mutationFn: ({ question, documentId }) => 
      searchService.askQuestion({ question, documentId }),
  });
}

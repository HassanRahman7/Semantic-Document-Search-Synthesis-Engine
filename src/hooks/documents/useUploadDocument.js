import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, onUploadProgress }) => 
      documentService.uploadDocument(file, onUploadProgress),
    onSuccess: () => {
      // Invalidate the documents list query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

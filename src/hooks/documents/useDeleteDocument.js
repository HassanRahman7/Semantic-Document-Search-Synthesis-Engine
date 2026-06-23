import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => documentService.deleteDocument(id),
    onSuccess: () => {
      // Invalidate the documents list query to trigger a refresh
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });
}

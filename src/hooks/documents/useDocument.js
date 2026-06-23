import { useQuery } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';

export function useDocument(id) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocument(id),
    enabled: !!id,
  });
}

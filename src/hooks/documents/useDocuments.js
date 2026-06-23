import { useQuery } from '@tanstack/react-query';
import { documentService } from '../../services/documentService';

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: documentService.getDocuments,
    select: (data) => data.documents || [],
  });
}

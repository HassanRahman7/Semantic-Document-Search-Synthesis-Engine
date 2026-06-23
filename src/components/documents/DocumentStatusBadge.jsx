import React from 'react';
import Badge from '../Badge';

export default function DocumentStatusBadge({ status }) {
  const normalizedStatus = (status || '').toLowerCase();

  switch (normalizedStatus) {
    case 'indexed':
    case 'success':
      return <Badge variant="indexed">Indexed</Badge>;
    case 'processing':
    case 'uploaded':
      return <Badge variant="processing">Processing</Badge>;
    case 'failed':
      return <Badge variant="failed">Failed</Badge>;
    default:
      return <Badge variant="default">{status || 'Unknown'}</Badge>;
  }
}

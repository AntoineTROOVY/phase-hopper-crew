
import React from 'react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = (status: string): string => {
    const lowerStatus = status.toLowerCase();
    
    if (lowerStatus.includes('completed') || lowerStatus.includes('done') || lowerStatus.includes('finished')) {
      return 'bg-green-100 text-green-800 border-green-200';
    } else if (lowerStatus.includes('review')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (lowerStatus.includes('progress') || lowerStatus.includes('ongoing') || lowerStatus.includes('started')) {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (lowerStatus.includes('risk') || lowerStatus.includes('danger') || lowerStatus.includes('critical')) {
      return 'bg-red-100 text-red-800 border-red-200';
    } else if (lowerStatus.includes('hold') || lowerStatus.includes('pause') || lowerStatus.includes('waiting')) {
      return 'bg-amber-100 text-amber-800 border-amber-200';
    } else {
      return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 text-xs font-medium rounded-full border',
        getStatusColor(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;

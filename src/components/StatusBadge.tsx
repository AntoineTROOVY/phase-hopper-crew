
import React from 'react';
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/data/projects';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusColor = (status: ProjectStatus): string => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'At Risk':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
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

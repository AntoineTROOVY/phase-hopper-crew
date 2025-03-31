
import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    inReview: number;
    filtered: number;
  };
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-3 mt-2">
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
          {stats.total}
        </span>
        <span className="text-sm text-gray-600">Total Projects</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-green-100 text-green-700">
          {stats.completed}
        </span>
        <span className="text-sm text-gray-600">Completed</span>
      </div>
      
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-amber-100 text-amber-700">
          {stats.inReview}
        </span>
        <span className="text-sm text-gray-600">In Review</span>
      </div>
      
      {stats.filtered !== stats.total && (
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {stats.filtered}
          </span>
          <span className="text-sm text-gray-600">Filtered</span>
        </div>
      )}
    </div>
  );
};

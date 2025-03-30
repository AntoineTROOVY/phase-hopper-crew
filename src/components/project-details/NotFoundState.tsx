
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface NotFoundStateProps {
  projectId?: string;
}

const NotFoundState = ({ projectId }: NotFoundStateProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Project not found</h2>
        <p className="text-gray-500 mb-4">
          {projectId ? `No project found with ID: ${projectId}` : 'The project you\'re looking for doesn\'t exist.'}
        </p>
        <Button asChild>
          <Link to="/">Go back to dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFoundState;

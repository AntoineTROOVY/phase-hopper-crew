
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { PipelineProject } from '@/services/projectService';

interface ProjectStatusCardProps {
  project: PipelineProject;
}

const ProjectStatusCard = ({ project }: ProjectStatusCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="font-semibold">Project Status</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Current Status</p>
            <StatusBadge status={project["Status"] || 'Unknown'} className="mt-1" />
          </div>
          <div>
            <p className="text-sm font-medium">Phase</p>
            <p className="text-sm mt-1">{project["Phase"] || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;

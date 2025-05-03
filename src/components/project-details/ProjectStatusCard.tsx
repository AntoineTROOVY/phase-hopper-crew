
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { PipelineProject } from '@/services/projectService';

interface ProjectStatusCardProps {
  project: PipelineProject;
}

const ProjectStatusCard = ({ project }: ProjectStatusCardProps) => {
  return (
    <Card className="glass-card overflow-hidden backdrop-blur animate-fade-in">
      <CardHeader className="pb-2 border-b border-[#2a2f3b]">
        <h3 className="font-semibold text-lg text-white tracking-wide">Project Status</h3>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="group transition-all duration-300 hover:translate-y-[-3px]">
            <p className="text-sm font-medium text-gray-400 mb-2">Current Status</p>
            <StatusBadge status={project["Status"] || 'Unknown'} className="mt-1 shadow-glow-sm" />
          </div>
          <div className="group transition-all duration-300 hover:translate-y-[-3px]">
            <p className="text-sm font-medium text-gray-400 mb-2">Phase</p>
            <p className="text-sm mt-1 px-3 py-1.5 rounded-md bg-secondary/70 inline-block text-primary border border-primary/20 shadow-[0_0_10px_rgba(78,144,255,0.1)]">{project["Phase"] || 'N/A'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatusCard;

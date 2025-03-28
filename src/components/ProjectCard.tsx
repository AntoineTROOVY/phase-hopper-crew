
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Building, User, Clock } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import StatusBadge from './StatusBadge';
import { PipelineProject } from '@/services/projectService';

interface ProjectCardProps {
  project: PipelineProject;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [searchParams] = useSearchParams();
  const slackId = searchParams.get('slack-id');
  
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  // Create the project link with the SlackID parameter preserved
  const projectLink = `/project/${encodeURIComponent(project["ID-PROJET"] || '')}${slackId ? `?slack-id=${slackId}` : ''}`;

  return (
    <Link 
      to={projectLink}
      className="block transition-transform hover:scale-[1.02] focus:outline-none"
    >
      <Card className="h-full">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold truncate">{project["Company"] || 'Untitled Project'}</h3>
              <p className="text-sm text-gray-500 truncate">ID: {project["ID-PROJET"] || 'N/A'}</p>
            </div>
            <StatusBadge status={project["Status"] || 'Unknown'} />
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2 pb-2">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-400" />
              <span className="text-sm truncate">{project["Client"] || 'No client'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm truncate">Phase: {project["Phase"] || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Start: {formatDate(project["Date de début"])}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm">Deadline: {formatDate(project["Deadline"])}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 border-t bg-gray-50">
          <div className="flex items-center gap-2 w-full">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Duration: {project["Duration"] || 'N/A'}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ProjectCard;

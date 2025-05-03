
import React from 'react';
import { Calendar, Building, User, Clock, NotepadText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { PipelineProject } from '@/services/projectService';

interface ProjectInfoProps {
  project: PipelineProject;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const logoUrl = project["Logo url"] || '';
  const briefUrl = project["Brief main"] || '';

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const openBrief = (url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="glass-card backdrop-blur animate-fade-in">
      <CardHeader className="pb-2 border-b border-[#2a2f3b]">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {logoUrl && <div className="flex-shrink-0">
                <div className="p-2 bg-white/5 rounded-lg border border-[#2a2f3b] shadow-inner-glow">
                  <img 
                    src={logoUrl} 
                    alt={`${project["Company"]} logo`} 
                    className="h-12 w-auto object-contain rounded-md" 
                    onError={e => {
                      console.error('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }} 
                  />
                </div>
              </div>}
            <div>
              <h2 className="text-xl font-semibold text-white tracking-wide">{project["Company"] || 'Untitled Project'}</h2>
            </div>
          </div>
          <StatusBadge status={project["Status"] || 'Unknown'} className="shadow-glow-sm" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 mt-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 group transition-all duration-300 hover:translate-y-[-3px] p-3 rounded-lg bg-black/20 border border-[#2a2f3b]">
              <Calendar className="h-5 w-5 text-glow-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-300">Start Date</p>
                <p className="text-sm text-gray-500">{formatDate(project["Date de début"])}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group transition-all duration-300 hover:translate-y-[-3px] p-3 rounded-lg bg-black/20 border border-[#2a2f3b]">
              <Calendar className="h-5 w-5 text-glow-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-300">Deadline</p>
                <p className="text-sm text-gray-500">{formatDate(project["Deadline"])}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group transition-all duration-300 hover:translate-y-[-3px] p-3 rounded-lg bg-black/20 border border-[#2a2f3b]">
              <Clock className="h-5 w-5 text-glow-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-300">Duration</p>
                <p className="text-sm text-gray-500">{project["Duration"] || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group transition-all duration-300 hover:translate-y-[-3px] p-3 rounded-lg bg-black/20 border border-[#2a2f3b]">
              <Building className="h-5 w-5 text-glow-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-300">Company</p>
                <p className="text-sm text-gray-500">{project["Company"] || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group transition-all duration-300 hover:translate-y-[-3px] p-3 rounded-lg bg-black/20 border border-[#2a2f3b]">
              <User className="h-5 w-5 text-glow-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-300">Phase</p>
                <p className="text-sm text-gray-500">{project["Phase"] || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 group transition-all duration-300 hover:translate-y-[-3px] p-3 rounded-lg bg-black/20 border border-[#2a2f3b]">
              <NotepadText className="h-5 w-5 text-glow-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-300">Brief</p>
                {briefUrl ? (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    Available
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 py-1 text-glow-blue hover:bg-glow-blue/10 hover:shadow-glow-sm transition-all duration-300" 
                      onClick={() => openBrief(briefUrl)}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">Not available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;

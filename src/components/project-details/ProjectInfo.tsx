import React from 'react';
import { Calendar, Building, User, Clock, NotepadText, ExternalLink, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StatusBadge from '@/components/StatusBadge';
import { PipelineProject } from '@/services/projectService';
import ProjectContentLinks from '@/components/project-details/ProjectContentLinks';

interface ProjectInfoProps {
  project: PipelineProject;
}

const ProjectInfo = ({ project }: ProjectInfoProps) => {
  const logoUrl = project["Logo url"] || '';
  const briefUrl = project["Brief main"] || '';
  const hookVariations = project["Hook variations"];

  // Function to format hook variations
  const formatHookVariations = () => {
    if (!hookVariations || hookVariations === "N/A" || Array.isArray(hookVariations) && hookVariations.includes("N/A")) {
      return null;
    }
    
    let variationCount = 0;
    if (typeof hookVariations === 'string') {
      const match = hookVariations.match(/(\d+)\s+hook\s+variation/i);
      if (match && match[1]) {
        variationCount = parseInt(match[1], 10);
      }
    } else if (Array.isArray(hookVariations)) {
      // Find the highest number if multiple options are selected
      hookVariations.forEach(variation => {
        const match = variation.match(/(\d+)\s+hook\s+variation/i);
        if (match && match[1]) {
          const count = parseInt(match[1], 10);
          if (count > variationCount) variationCount = count;
        }
      });
    }
    
    if (variationCount > 0) {
      // Toujours afficher 3s quelle que soit la valeur
      return `+${variationCount} (3s)`;
    }
    
    return null;
  };

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

  const hookVariationsFormatted = formatHookVariations();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {logoUrl && <div className="flex-shrink-0">
                <img src={logoUrl} alt={`${project["Company"]} logo`} className="h-12 w-auto object-contain rounded-md" onError={e => {
              console.error('Error loading logo:', e);
              e.currentTarget.style.display = 'none';
            }} />
              </div>}
            <div>
              <h2 className="text-xl font-semibold">{project["Company"] || 'Untitled Project'}</h2>
            </div>
          </div>
          <StatusBadge status={project["Status"] || 'Unknown'} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm text-gray-500">{formatDate(project["Date de début"])}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Deadline</p>
                <p className="text-sm text-gray-500">{formatDate(project["Deadline"])}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-sm text-gray-500">{project["Duration"] || 'N/A'}</p>
              </div>
            </div>
            {hookVariationsFormatted && (
            <div className="flex items-center gap-3">
                <FilePlus2 className="h-5 w-5 text-gray-400" />
              <div>
                  <p className="text-sm font-medium">Hook Variation</p>
                  <p className="text-sm text-gray-500">{hookVariationsFormatted}</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Phase</p>
                <p className="text-sm text-gray-500">{project["Phase"] || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotepadText className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Brief</p>
                {briefUrl ? (
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    Available
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 py-1" 
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
          
          {/* Project Content Links */}
          <div className="mt-6">
            <ProjectContentLinks project={project} insideInfo={true} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectInfo;

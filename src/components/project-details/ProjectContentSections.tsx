
// Fix the CollapsiblePreview props by adding missing children property
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookText, Film, Mic, Package } from 'lucide-react';
import ScriptPreview from '@/components/ScriptPreview';
import CollapsiblePreview from '@/components/CollapsiblePreview';
import VoiceOverPreview from '@/components/VoiceOverPreview';
import { PipelineProject } from '@/services/projectService';
import VariationsSelectionModal from '@/components/variations/VariationsSelectionModal';

interface ProjectContentSectionsProps {
  project: PipelineProject;
}

const ProjectContentSections = ({ project }: ProjectContentSectionsProps) => {
  return (
    <div className="grid gap-6 mt-6">
      {/* Script Section */}
      {project["Script"] && (
        <Card>
          <CardContent className="pt-6">
            <ScriptPreview 
              title="Script" 
              icon={<BookText className="h-5 w-5" />} 
              scriptContent={project["Script"]} 
            />
          </CardContent>
        </Card>
      )}
      
      {/* Animation and Storyboard */}
      {(project["Animation"] || project["Storyboard"]) && (
        <Card>
          <CardContent className="pt-6">
            {project["Animation"] && (
              <CollapsiblePreview 
                title="Animation" 
                icon={<Film className="h-5 w-5" />}
                currentPhase={project["Phase"] || ''}
                relevantPhase="Animation"
                projectStatus={project["Status"] || ''}
                externalUrl={project["Animation"]}
                projectId={project["ID-PROJET"] || ''}
              >
                Animation preview content
              </CollapsiblePreview>
            )}
            
            {project["Animation"] && project["Storyboard"] && (
              <div className="my-4 border-t border-gray-200"></div>
            )}
            
            {project["Storyboard"] && (
              <CollapsiblePreview 
                title="Storyboard" 
                icon={<BookText className="h-5 w-5" />}
                currentPhase={project["Phase"] || ''}
                relevantPhase="Storyboard"
                projectStatus={project["Status"] || ''}
                externalUrl={project["Storyboard"]}
                projectId={project["ID-PROJET"] || ''}
              >
                Storyboard preview content
              </CollapsiblePreview>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Voice Over */}
      {project["Voice-file-url"] && (
        <Card>
          <CardContent className="pt-6">
            <VoiceOverPreview 
              title="Voice Over" 
              icon={<Mic className="h-5 w-5" />}
              projectId={project["ID-PROJET"] || ''}
              languages={project["Langues"] || ''}
              voiceFileUrl={project["Voice-file-url"]}
            />
          </CardContent>
        </Card>
      )}
      
      {/* Variations */}
      {project["ID-PROJET"] && project["Langues"] && (
        <Card>
          <CardContent className="pt-6">
            <CollapsiblePreview 
              title="Variations" 
              icon={<Package className="h-5 w-5" />}
              currentPhase={project["Phase"] || ''}
              relevantPhase="Animation"
              projectStatus={project["Status"] || ''}
              externalUrl={project["Variations-url"] || ''}
              projectId={project["ID-PROJET"] || ''}
              customButton={
                <VariationsSelectionModal 
                  open={false}
                  onOpenChange={() => {}}
                  projectId={project["ID-PROJET"]}
                  languages={project["Langues"]}
                />
              }
            >
              Variations preview content
            </CollapsiblePreview>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProjectContentSections;

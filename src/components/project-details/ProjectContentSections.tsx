
import React from 'react';
import { FileText, Mic, Image, Film, Package } from 'lucide-react';
import CollapsiblePreview from '@/components/CollapsiblePreview';
import ScriptPreview from '@/components/ScriptPreview';
import VoiceOverPreview from '@/components/VoiceOverPreview';
import StoryboardPreview from '@/components/StoryboardPreview';
import AnimationPreview from '@/components/AnimationPreview';
import VariationsPreview from '@/components/VariationsPreview';
import { PipelineProject } from '@/services/projectService';

interface ProjectContentSectionsProps {
  project: PipelineProject;
}

const ProjectContentSections = ({ project }: ProjectContentSectionsProps) => {
  // Helper to determine if voice over section should be shown
  const shouldShowVoiceOver = project["Voice-file-url"] && 
    project["Voice-file-url"].length > 0 || 
    project["Phase"]?.toLowerCase().includes('voice') && 
    (project["Status"]?.toLowerCase().includes('not') && 
    project["Status"]?.toLowerCase().includes('start') || 
    project["Status"]?.toLowerCase().includes('in progress'));
  
  // Helper for phase checks
  const isVoiceOverPhase = project["Phase"]?.includes("🎙️Voice-over") || false;
  const isVariationsPhase = project["Phase"]?.includes("📦 Variations") || false;

  return (
    <>
      {project["Script"] && (
        <CollapsiblePreview 
          title="Script Preview" 
          icon={<FileText className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Copywriting" 
          projectStatus={project["Status"]} 
          externalUrl={project["Script"]} 
          projectId={project["ID-PROJET"] || ''}
        >
          <ScriptPreview scriptUrl={project["Script"]} />
        </CollapsiblePreview>
      )}
      
      {shouldShowVoiceOver && (
        <CollapsiblePreview 
          title="Voice-Over Preview" 
          icon={<Mic className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Voice" 
          projectStatus={project["Status"]} 
          projectId={project["ID-PROJET"] || ''}
          initialOpen={isVoiceOverPhase}
        >
          <VoiceOverPreview 
            voiceFileUrl={project["Voice-file-url"] || ''} 
            phase={project["Phase"] || ''} 
            status={project["Status"] || ''} 
            projectId={project["ID-PROJET"] || ''} 
            languages={project["Langues"] || ''} 
          />
        </CollapsiblePreview>
      )}
      
      {project["Storyboard"] && (
        <CollapsiblePreview 
          title="Storyboard Preview" 
          icon={<Image className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Storyboard" 
          projectStatus={project["Status"]} 
          externalUrl={project["Storyboard"]} 
          projectId={project["ID-PROJET"] || ''}
        >
          <StoryboardPreview storyboardUrl={project["Storyboard"]} />
        </CollapsiblePreview>
      )}
      
      {project["Animation"] && (
        <CollapsiblePreview 
          title="Animation Preview" 
          icon={<Film className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Animation" 
          projectStatus={project["Status"]} 
          externalUrl={project["Animation"]} 
          projectId={project["ID-PROJET"] || ''}
        >
          <AnimationPreview animationUrl={project["Animation"]} />
        </CollapsiblePreview>
      )}
      
      {project["Variations-url"] && (
        <CollapsiblePreview 
          title="Variations Preview" 
          icon={<Package className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Variations" 
          projectStatus={project["Status"]} 
          externalUrl={project["Variations-url"]} 
          projectId={project["ID-PROJET"] || ''}
          initialOpen={isVariationsPhase}
        >
          <VariationsPreview variationsUrl={project["Variations-url"]} />
        </CollapsiblePreview>
      )}
    </>
  );
};

export default ProjectContentSections;

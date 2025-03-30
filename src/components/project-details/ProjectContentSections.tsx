import React, { useState } from 'react';
import { FileText, Mic, Image, Film, Package } from 'lucide-react';
import CollapsiblePreview from '@/components/CollapsiblePreview';
import ScriptPreview from '@/components/ScriptPreview';
import VoiceOverPreview from '@/components/VoiceOverPreview';
import VariationsSelectionModal from '@/components/variations/VariationsSelectionModal';
import { PipelineProject } from '@/services/projectService';
interface ProjectContentSectionsProps {
  project: PipelineProject;
}
const ProjectContentSections = ({
  project
}: ProjectContentSectionsProps) => {
  const [variationsModalOpen, setVariationsModalOpen] = useState(false);

  // Helper to determine if voice over section should be shown
  const shouldShowVoiceOver = project["Voice-file-url"] && project["Voice-file-url"].length > 0 || project["Phase"]?.toLowerCase().includes('voice') && (project["Status"]?.toLowerCase().includes('not') && project["Status"]?.toLowerCase().includes('start') || project["Status"]?.toLowerCase().includes('in progress'));

  // Helper to determine if variations section should be shown
  const shouldShowVariations = project["Variations-url"] && project["Variations-url"].length > 0 || project["Phase"]?.toLowerCase().includes('variations') && project["Status"]?.toLowerCase().includes('not') && project["Status"]?.toLowerCase().includes('start');

  // Helper for phase checks
  const isVoiceOverPhase = project["Phase"]?.includes("🎙️Voice-over") || false;
  const isVariationsPhase = project["Phase"]?.includes("📦 Variations") || false;

  // Determine if variations section is in "Not started" state
  const isVariationsNotStarted = isVariationsPhase && project["Status"]?.toLowerCase().includes('not') && project["Status"]?.toLowerCase().includes('start') && (!project["Variations-url"] || project["Variations-url"].length === 0);
  const handleVariationsRequest = () => {
    setVariationsModalOpen(true);
  };
  const handleVariationsComplete = () => {
    // This would typically refresh the data or update UI state
    console.log("Variations requested successfully");
  };
  return <>
      {project["Script"] && <CollapsiblePreview title="Script Preview" icon={<FileText className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Copywriting" projectStatus={project["Status"]} externalUrl={project["Script"]} projectId={project["ID-PROJET"] || ''}>
          <ScriptPreview scriptUrl={project["Script"]} />
        </CollapsiblePreview>}
      
      {shouldShowVoiceOver && <CollapsiblePreview title="Voice-Over Preview" icon={<Mic className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Voice" projectStatus={project["Status"]} projectId={project["ID-PROJET"] || ''} initialOpen={isVoiceOverPhase}>
          <VoiceOverPreview voiceFileUrl={project["Voice-file-url"] || ''} phase={project["Phase"] || ''} status={project["Status"] || ''} projectId={project["ID-PROJET"] || ''} languages={project["Langues"] || ''} />
        </CollapsiblePreview>}
      
      {project["Storyboard"] && <CollapsiblePreview title="Storyboard" icon={<Image className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Storyboard" projectStatus={project["Status"]} externalUrl={project["Storyboard"]} projectId={project["ID-PROJET"] || ''}>
          
        </CollapsiblePreview>}
      
      {project["Animation"] && <CollapsiblePreview title="Animation" icon={<Film className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Animation" projectStatus={project["Status"]} externalUrl={project["Animation"]} projectId={project["ID-PROJET"] || ''}>
          
        </CollapsiblePreview>}
      
      {shouldShowVariations && <CollapsiblePreview title="Variations" icon={<Package className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Variations" projectStatus={project["Status"]} externalUrl={project["Variations-url"] || ''} projectId={project["ID-PROJET"] || ''} initialOpen={isVariationsPhase} highlightAction={isVariationsNotStarted}>
          <div className="text-center py-4">
            {isVariationsNotStarted ? <div className="flex flex-col items-center">
                <p className="text-amber-600 mb-4">
                  No variations have been requested yet. Please request variations to proceed.
                </p>
                <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2" onClick={handleVariationsRequest}>
                  <Package className="h-4 w-4" />
                  Ask for variations
                </button>
              </div> : <div className="text-gray-500">
                Open link to view variations
              </div>}
          </div>
        </CollapsiblePreview>}
      
      <VariationsSelectionModal open={variationsModalOpen} onOpenChange={setVariationsModalOpen} projectId={project["ID-PROJET"]} languages={project["Langues"]} onSelectionComplete={handleVariationsComplete} />
    </>;
};
export default ProjectContentSections;
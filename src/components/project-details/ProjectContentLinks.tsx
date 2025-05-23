import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PipelineProject } from '@/services/projectService';
import VoiceOverPreview from '@/components/voice/VoiceOverPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface ProjectContentLinksProps {
  project: PipelineProject;
  insideInfo?: boolean;
}

// Chemins vers les images locales avec les nouvelles images du design Figma
const contentImages = {
  'Brief document': '/img/brief-image.png',
  'Script': '/img/script-image.png',
  'Storyboard': '/img/storyboard-image.png',
  'Voice-Over': '/img/voice-over-image.png',
  'Animation': '/img/animation-image.png',
  'Déclinaisons': '/img/variations-image.png',
};

const ProjectContentLinks: React.FC<ProjectContentLinksProps> = ({ project, insideInfo = true }) => {
  const [voiceOverModalOpen, setVoiceOverModalOpen] = useState(false);
  
  // Fonction pour gérer le clic sur un élément
  const handleItemClick = (title: string, link: string | null | undefined, e: React.MouseEvent) => {
    if (title === 'Voice-Over') {
      e.preventDefault(); // Empêche le comportement de lien par défaut
      setVoiceOverModalOpen(true);
      return false;
    }
    return true; // Continue avec le comportement de lien par défaut
  };
  
  // Fonction pour déterminer si une phase spécifique est approuvée
  const isPhaseApproved = (phaseName: string): boolean => {
    const currentPhase = project["Phase"] || '';
    const currentStatus = project["Status"] || '';
    const lowerCurrentPhase = currentPhase.toLowerCase();
    const lowerPhaseName = phaseName.toLowerCase();
    const lowerStatus = currentStatus.toLowerCase();
    
    // Define the phase order for comparison
    const phases = ['copywriting', 'voice', 'storyboard', 'animation', 'variations'];
    
    // Get indices for comparison
    const phaseIndex = phases.findIndex(p => p.includes(lowerPhaseName));
    const currentPhaseIndex = phases.findIndex(p => lowerCurrentPhase.includes(p));
    
    // If the current phase matches the requested phase and status is approved
    if (lowerCurrentPhase.includes(lowerPhaseName) && lowerStatus.includes('approved')) {
      return true;
    }
    
    // If we've moved past this phase (it's completed)
    if (phaseIndex < currentPhaseIndex) {
      return true;
    }
    
    return false;
  };
  
  // Définition des éléments à afficher
  const contentItems = [
    {
      title: 'Brief document',
      link: project["Brief main"],
      visible: !!project["Brief main"] && isPhaseApproved('copywriting')
    },
    {
      title: 'Script',
      link: project["Script"],
      visible: !!project["Script"] && isPhaseApproved('copywriting')
    },
    {
      title: 'Storyboard',
      link: project["Storyboard"],
      visible: !!project["Storyboard"] && isPhaseApproved('storyboard')
    },
    {
      title: 'Voice-Over',
      link: project["Voice-file-url"],
      visible: (!!project["Voice-file-url"] || project["Voice-Over"] === true) && isPhaseApproved('voice')
    },
    {
      title: 'Animation',
      link: project["Animation"],
      visible: !!project["Animation"] && isPhaseApproved('animation')
    },
    {
      title: 'Déclinaisons',
      link: project["Variations-url"],
      visible: !!project["Variations-url"] && isPhaseApproved('variations')
    }
  ];

  // Filtrer les éléments visibles
  const visibleItems = contentItems.filter(item => item.visible);

  // Si aucun élément n'est visible, ne pas afficher le composant
  if (visibleItems.length === 0) return null;
  
  return (
    <>
      <div className={insideInfo ? "" : "mb-6"}>
        {!insideInfo && <h3 className="text-lg font-semibold mb-4">Contenu du projet</h3>}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {visibleItems.map((item, index) => (
            <a 
              key={index}
              href={item.link as string}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-[#D2D2D2] rounded-[12.5px] overflow-hidden shadow-md transition-all cursor-pointer flex flex-col relative"
              style={{ 
                height: "150px", 
                boxShadow: "0px 4px 12.6px rgba(0, 0, 0, 0.05)"
              }}
              onClick={(e) => !handleItemClick(item.title, item.link, e) && e.preventDefault()}
            >
              <div className="p-6 pt-6 z-10">
                <div className="flex items-center">
                  <span className="font-medium text-sm">{item.title}</span>
                  <span className="text-xs ml-1">↗</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: "139px" }}>
                <img 
                  src={contentImages[item.title]} 
                  alt={item.title}
                  className="object-contain w-full h-auto"
                  style={{ 
                    position: "absolute", 
                    bottom: "0", 
                    left: "6px", 
                    width: "139px", 
                    height: "139px",
                  }}
                  onError={(e) => {
                    console.error(`Failed to load image for ${item.title}`);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </a>
          ))}
        </div>
      </div>
      
      {/* Modal de Voice-Over Preview */}
      <Dialog open={voiceOverModalOpen} onOpenChange={setVoiceOverModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogTitle className="text-xl">Voice-Over Preview</DialogTitle>
            <DialogClose className="h-6 w-6 rounded-full hover:bg-gray-100 p-1">
              <X className="h-4 w-4" />
            </DialogClose>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto">
            <VoiceOverPreview 
              voiceFileUrl={project["Voice-file-url"] || ''}
              voiceFile={project["Voice-file"]}
              phase={project["Phase"] || ''}
              status={project["Status"] || ''}
              projectId={project["ID-PROJET"] || ''}
              languages={project["Langues"] || ''}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectContentLinks; 
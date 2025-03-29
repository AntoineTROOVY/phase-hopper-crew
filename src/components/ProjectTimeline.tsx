
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { FileText, Headphones, Image, Film, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define phase types with emoji prefixes
type ProjectPhase = 
  | '📝 Copywriting' 
  | '🎙️Voice-over' 
  | '🖼️ Storyboard' 
  | '🎞️ Animation' 
  | '📦 Variations' 
  | string;

// Define phases array with emoji prefixes
const phases: ProjectPhase[] = [
  '📝 Copywriting',
  '🎙️Voice-over',
  '🖼️ Storyboard',
  '🎞️ Animation',
  '📦 Variations'
];

// Define phase icons mapping
const phaseIcons: Record<string, React.ReactNode> = {
  '📝 Copywriting': <FileText className="h-6 w-6" />,
  '🎙️Voice-over': <Headphones className="h-6 w-6" />,
  '🖼️ Storyboard': <Image className="h-6 w-6" />,
  '🎞️ Animation': <Film className="h-6 w-6" />,
  '📦 Variations': <Package className="h-6 w-6" />
};

interface ProjectTimelineProps {
  currentPhase: string;
}

const ProjectTimeline = ({ currentPhase }: ProjectTimelineProps) => {
  // Function to normalize phase names for comparison
  const normalizePhase = (phase: string): ProjectPhase => {
    // Map of possible phase variations to standardized phase names with emojis
    const phaseMap: Record<string, ProjectPhase> = {
      'copywriting': '📝 Copywriting',
      '📝 copywriting': '📝 Copywriting',
      '📝copywriting': '📝 Copywriting',
      
      'voice-over': '🎙️Voice-over',
      'voiceover': '🎙️Voice-over',
      '🎙️voice-over': '🎙️Voice-over',
      '🎙️voiceover': '🎙️Voice-over',
      '🎙️ voice-over': '🎙️Voice-over',
      '🎙️ voiceover': '🎙️Voice-over',
      
      'storyboard': '🖼️ Storyboard',
      '🖼️storyboard': '🖼️ Storyboard',
      '🖼️ storyboard': '🖼️ Storyboard',
      
      'animation': '🎞️ Animation',
      '🎞️animation': '🎞️ Animation',
      '🎞️ animation': '🎞️ Animation',
      
      'variations': '📦 Variations',
      '📦variations': '📦 Variations',
      '📦 variations': '📦 Variations',
    };
    
    // Try direct match first
    if (phases.includes(phase)) {
      return phase as ProjectPhase;
    }
    
    // Try case-insensitive matching
    const normalized = phase?.toLowerCase();
    for (const [key, value] of Object.entries(phaseMap)) {
      if (normalized === key.toLowerCase() || normalized?.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    return phase;
  };

  const normalizedCurrentPhase = normalizePhase(currentPhase);
  
  // Find the index of the current phase
  const currentPhaseIndex = phases.findIndex(
    phase => phase === normalizedCurrentPhase
  );
  
  // Calculate completion percentage
  const completionPercentage = currentPhaseIndex >= 0 
    ? Math.round(((currentPhaseIndex + 1) / phases.length) * 100) 
    : 0;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">Project Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{completionPercentage}% Complete</span>
          <span className="px-2 py-1 text-xs bg-[#4E90FF]/10 text-[#4E90FF] rounded-full">
            Current: {normalizedCurrentPhase || 'Not started'}
          </span>
        </div>
      </div>
      
      <Progress value={completionPercentage} className="h-2 mb-6" />
      
      <div className="relative flex flex-col sm:flex-row justify-between items-center w-full">
        {/* Connector line */}
        <div className="hidden sm:block absolute top-7 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        
        {phases.map((phase, index) => {
          const isCurrentPhase = phase === normalizedCurrentPhase;
          const isPastPhase = currentPhaseIndex >= 0 && index < currentPhaseIndex;
          const isFuturePhase = currentPhaseIndex >= 0 && index > currentPhaseIndex;
          
          // Determine connector color/style between this phase and next
          const connectorClass = isPastPhase 
            ? "bg-[#4E90FF]" // Solid blue for completed phases
            : "bg-gray-200"; // Dashed or light for upcoming phases
          
          // Calculate the width needed to connect this phase to the next (except last phase)
          const showConnector = index < phases.length - 1;
          
          return (
            <div key={phase} className="flex flex-col items-center mb-4 sm:mb-0 z-10">
              {/* If not the first phase on mobile, show a connector */}
              {index > 0 && index <= currentPhaseIndex && (
                <div className="block sm:hidden h-6 w-0.5 bg-[#4E90FF] -mt-2 mb-2" />
              )}
              
              {/* Phase icon circle */}
              <div 
                className={cn(
                  "flex items-center justify-center w-14 h-14 rounded-full border-2",
                  isCurrentPhase ? "border-[#4E90FF] bg-white text-[#4E90FF]" : 
                  isPastPhase ? "border-[#4E90FF] bg-[#4E90FF] text-white" : 
                  "border-gray-200 bg-white text-gray-400"
                )}
              >
                {phaseIcons[phase]}
              </div>
              
              {/* If not the last phase and on mobile view, show a connector to the next phase */}
              {showConnector && isFuturePhase && (
                <div className="block sm:hidden h-6 w-0.5 bg-gray-200 mt-2 mb-2" />
              )}
              
              {/* Phase name */}
              <p className={cn(
                "font-medium mt-2 text-center whitespace-nowrap",
                isCurrentPhase ? "text-[#4E90FF]" : 
                isPastPhase ? "text-gray-900" : 
                "text-gray-400"
              )}>
                {phase.split(' ')[1] || phase}
              </p>
              
              {/* Phase status */}
              <p className={cn(
                "text-xs mt-1",
                isCurrentPhase ? "text-[#4E90FF]" : 
                isPastPhase ? "text-green-600" : 
                "text-gray-400"
              )}>
                {isCurrentPhase 
                  ? "In Progress" 
                  : isPastPhase 
                    ? "Completed" 
                    : "Not Started"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;

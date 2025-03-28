
import React from 'react';
import { Progress } from '@/components/ui/progress';

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
      
      <Progress value={completionPercentage} className="h-2 mb-4" />
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {phases.map((phase, index) => {
          const isCurrentPhase = phase === normalizedCurrentPhase;
          const isPastPhase = currentPhaseIndex >= 0 && index < currentPhaseIndex;
          
          return (
            <div 
              key={phase}
              className={`flex flex-col items-center p-2 h-16 rounded-md transition-colors ${
                isCurrentPhase 
                  ? 'bg-gradient-to-r from-[#4E90FF] from-50% to-[#0F3B7F] to-50%' 
                  : isPastPhase
                    ? 'bg-[#4E90FF] text-white'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <span className={`font-medium text-center ${
                isCurrentPhase 
                  ? 'text-lg text-white drop-shadow-md shadow-black' 
                  : isPastPhase 
                    ? 'text-lg text-white' 
                    : 'text-sm'
              }`}>
                {phase}
              </span>
              {isPastPhase && (
                <span className="mt-1 text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">
                  Completed
                </span>
              )}
              {isCurrentPhase && (
                <span className="mt-1 text-[10px] bg-white text-[#4E90FF] px-1.5 py-0.5 rounded-full drop-shadow-sm">
                  In Progress
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;

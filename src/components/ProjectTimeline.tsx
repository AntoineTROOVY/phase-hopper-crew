
import React from 'react';
import { Check, FileText, Headphones, Image, Film, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define phase types with standardized names
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

// Map phases to Lucide icons
const phaseIcons: Record<string, React.ElementType> = {
  '📝 Copywriting': FileText,
  '🎙️Voice-over': Headphones,
  '🖼️ Storyboard': Image,
  '🎞️ Animation': Film,
  '📦 Variations': Package,
};

// Phase status types
type PhaseStatus = 'Not Started' | 'In Progress' | 'In Review' | 'Approved' | string;

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

  // Function to determine phase status based on position relative to current phase
  const getPhaseStatus = (index: number): PhaseStatus => {
    if (currentPhaseIndex === -1) return 'Not Started';
    
    if (index < currentPhaseIndex) {
      return 'Approved';
    } else if (index === currentPhaseIndex) {
      return 'In Progress';
    } else {
      return 'Not Started';
    }
  };
  
  // Function to determine circle progress fill based on status
  const getProgressPercentage = (status: PhaseStatus): number => {
    switch(status.toLowerCase()) {
      case 'not started': return 0;
      case 'in progress': return 33;
      case 'in review': return 66;
      case 'approved': return 100;
      default: return 0;
    }
  };

  // Function to get color based on status
  const getStatusColor = (status: PhaseStatus): string => {
    switch(status.toLowerCase()) {
      case 'in progress': return 'text-[#4E90FF]';
      case 'approved': 
      case 'completed': return 'text-emerald-500';
      case 'in review': return 'text-amber-500';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <h3 className="text-lg font-semibold">Project Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{completionPercentage}% Complete</span>
          <span className="px-2 py-1 text-xs bg-[#4E90FF]/10 text-[#4E90FF] rounded-full">
            Current: {normalizedCurrentPhase || 'Not started'}
          </span>
        </div>
      </div>
      
      {/* Desktop/Tablet timeline (horizontal) */}
      <div className="hidden sm:block">
        <div className="relative flex items-center justify-between max-w-4xl mx-auto px-6">
          {/* Connecting lines */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200 -z-10"></div>
          
          {/* Completed lines (solid blue) */}
          {currentPhaseIndex > 0 && (
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-[#4E90FF] -z-10" 
              style={{ 
                width: `${(currentPhaseIndex / (phases.length - 1)) * 100}%` 
              }}
            ></div>
          )}
          
          {/* Phase circles */}
          {phases.map((phase, index) => {
            const phaseStatus = getPhaseStatus(index);
            const progressPercentage = getProgressPercentage(phaseStatus);
            const isCurrentPhase = index === currentPhaseIndex;
            const isPastPhase = index < currentPhaseIndex;
            const IconComponent = phaseIcons[phase] || FileText;
            
            return (
              <div key={phase} className="flex flex-col items-center gap-2">
                <div className="relative">
                  {/* Circle background */}
                  <div className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-full border-2",
                    isCurrentPhase ? "border-[#4E90FF]" : 
                    isPastPhase ? "border-[#4E90FF]" : "border-gray-200"
                  )}>
                    {/* Progress circle */}
                    {progressPercentage > 0 && (
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="21"
                          strokeWidth="4"
                          fill="transparent"
                          stroke="#E5E7EB"
                          className="opacity-25"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="21"
                          strokeWidth="4"
                          fill="transparent"
                          stroke={isPastPhase ? "#4E90FF" : "#4E90FF"}
                          strokeDasharray={`${2 * Math.PI * 21}`}
                          strokeDashoffset={`${2 * Math.PI * 21 * (1 - progressPercentage / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-in-out"
                        />
                      </svg>
                    )}
                    
                    {/* Icon */}
                    <div className="z-10">
                      {isPastPhase ? (
                        <div className="bg-[#4E90FF] text-white rounded-full p-2">
                          <Check className="w-5 h-5" />
                        </div>
                      ) : (
                        <IconComponent className={cn(
                          "w-5 h-5",
                          isCurrentPhase ? "text-[#4E90FF]" : "text-gray-400"
                        )} />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Phase label */}
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-semibold mb-1",
                    isCurrentPhase ? "text-[#4E90FF]" : isPastPhase ? "text-gray-900" : "text-gray-400"
                  )}>
                    {phase.replace(/^[^\w]*/, '')} {/* Remove emoji prefix */}
                  </p>
                  <span className={cn(
                    "text-xs",
                    getStatusColor(phaseStatus)
                  )}>
                    {isPastPhase ? 'Completed' : isCurrentPhase ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Mobile timeline (vertical) */}
      <div className="sm:hidden">
        <div className="relative space-y-6 mx-auto pl-8">
          {/* Vertical connecting line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 -z-10"></div>
          
          {/* Completed vertical line (solid blue) */}
          {currentPhaseIndex > 0 && (
            <div 
              className="absolute left-4 top-0 w-0.5 bg-[#4E90FF] -z-10" 
              style={{ 
                height: `${currentPhaseIndex >= phases.length ? '100%' : (currentPhaseIndex / (phases.length - 1)) * 100}%`
              }}
            ></div>
          )}
          
          {phases.map((phase, index) => {
            const phaseStatus = getPhaseStatus(index);
            const progressPercentage = getProgressPercentage(phaseStatus);
            const isCurrentPhase = index === currentPhaseIndex;
            const isPastPhase = index < currentPhaseIndex;
            const IconComponent = phaseIcons[phase] || FileText;
            
            return (
              <div key={phase} className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  {/* Circle background */}
                  <div className={cn(
                    "relative flex items-center justify-center w-8 h-8 rounded-full border-2",
                    isCurrentPhase ? "border-[#4E90FF]" : 
                    isPastPhase ? "border-[#4E90FF]" : "border-gray-200"
                  )}>
                    {/* Progress circle */}
                    {progressPercentage > 0 && (
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          strokeWidth="3"
                          fill="transparent"
                          stroke="#E5E7EB"
                          className="opacity-25"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          strokeWidth="3"
                          fill="transparent"
                          stroke={isPastPhase ? "#4E90FF" : "#4E90FF"}
                          strokeDasharray={`${2 * Math.PI * 14}`}
                          strokeDashoffset={`${2 * Math.PI * 14 * (1 - progressPercentage / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-500 ease-in-out"
                        />
                      </svg>
                    )}
                    
                    {/* Icon */}
                    <div className="z-10">
                      {isPastPhase ? (
                        <div className="bg-[#4E90FF] text-white rounded-full p-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <IconComponent className={cn(
                          "w-3.5 h-3.5",
                          isCurrentPhase ? "text-[#4E90FF]" : "text-gray-400"
                        )} />
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Phase label */}
                <div>
                  <p className={cn(
                    "text-sm font-semibold",
                    isCurrentPhase ? "text-[#4E90FF]" : isPastPhase ? "text-gray-900" : "text-gray-400"
                  )}>
                    {phase.replace(/^[^\w]*/, '')} {/* Remove emoji prefix */}
                  </p>
                  <span className={cn(
                    "text-xs",
                    getStatusColor(phaseStatus)
                  )}>
                    {isPastPhase ? 'Completed' : isCurrentPhase ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectTimeline;

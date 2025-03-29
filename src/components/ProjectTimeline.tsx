
import React from 'react';
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
  status?: string;
}

const ProjectTimeline = ({ currentPhase, status = '' }: ProjectTimelineProps) => {
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

  // Get progress percentage based on status
  const getProgressPercentage = (isPastPhase: boolean, isCurrentPhase: boolean, status?: string) => {
    if (isPastPhase) return 100; // Completed phases are 100%
    if (!isCurrentPhase) return 0; // Future phases are 0%
    
    // For current phase, determine progress based on status
    if (status?.toLowerCase().includes('not started')) return 0;
    if (status?.toLowerCase().includes('review')) return 90; // almost complete
    if (status?.toLowerCase().includes('progress')) return 33; // 1/3 complete
    if (status?.toLowerCase().includes('approved')) return 100; // Completed
    
    return 33; // Default to 1/3 for "In Progress"
  };

  // Draw circular progress arc
  const drawArc = (percentage: number) => {
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return {
      strokeDasharray: `${strokeDasharray}`,
      strokeDashoffset: `${strokeDashoffset}`
    };
  };

  // Determine phase status text based on relative position and project status
  const getPhaseStatus = (index: number) => {
    // If this phase is before the current phase, it's completed
    if (currentPhaseIndex > index) return "Completed";
    
    // If this phase is after the current phase, it's not started
    if (currentPhaseIndex < index) return "Not Started";
    
    // This is the current phase, determine status based on project status
    if (status?.toLowerCase().includes('not started')) return "Not Started";
    if (status?.toLowerCase().includes('review')) return "In Review";
    if (status?.toLowerCase().includes('approved')) return "Completed";
    if (status?.toLowerCase().includes('progress')) return "In Progress";
    
    // Default for current phase
    return "In Progress";
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">Project Progress</h3>
      </div>
      
      <div className="relative flex flex-col sm:flex-row justify-between items-center w-full">
        {/* Desktop connector lines - we'll add both bg colors and show/hide based on progress */}
        <div className="hidden sm:block absolute top-7 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        
        {/* Progress line (blue) that grows based on current phase */}
        <div 
          className="hidden sm:block absolute top-7 left-0 h-0.5 bg-[#4E90FF] z-0" 
          style={{
            width: `${Math.min(100, (currentPhaseIndex / (phases.length - 1)) * 100)}%`,
            transition: 'width 0.5s ease-in-out'
          }}
        />
        
        {phases.map((phase, index) => {
          const isCurrentPhase = phase === normalizedCurrentPhase;
          const isPastPhase = currentPhaseIndex >= 0 && index < currentPhaseIndex;
          const isFuturePhase = currentPhaseIndex >= 0 && index > currentPhaseIndex;
          
          // Get current phase progress percentage
          const progressPercentage = getProgressPercentage(isPastPhase, isCurrentPhase, status);
          
          // Calculate arc properties
          const arcProps = drawArc(progressPercentage);

          // Get the phase status text
          const phaseStatus = getPhaseStatus(index);
          
          return (
            <div key={phase} className="flex flex-col items-center mb-4 sm:mb-0 z-10">
              {/* Mobile view: vertical connector lines between circles */}
              {index > 0 && (
                <div 
                  className={cn(
                    "block sm:hidden h-6 w-0.5 -mt-2 mb-2",
                    index <= currentPhaseIndex ? "bg-[#4E90FF]" : "bg-gray-200"
                  )}
                />
              )}
              
              {/* Phase icon circle with progress ring */}
              <div className="relative flex items-center justify-center">
                {/* SVG for progress ring */}
                <svg width="56" height="56" className="absolute">
                  {/* Background circle */}
                  <circle 
                    cx="28" 
                    cy="28" 
                    r="24" 
                    fill="white" 
                    stroke={isFuturePhase ? "#E5E7EB" : isCurrentPhase ? "#E5E7EB" : "#4E90FF"} 
                    strokeWidth="2"
                  />
                  
                  {/* Progress arc - only show for current or completed phases */}
                  {(isCurrentPhase || isPastPhase) && progressPercentage > 0 && (
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      fill="transparent" 
                      stroke="#4E90FF" 
                      strokeWidth="2"
                      strokeLinecap="round"
                      transform="rotate(-90 28 28)"
                      style={{
                        ...arcProps,
                        transition: "stroke-dashoffset 0.5s ease-in-out"
                      }}
                    />
                  )}
                </svg>
                
                {/* Icon container */}
                <div 
                  className={cn(
                    "flex items-center justify-center w-14 h-14 rounded-full z-10",
                    isCurrentPhase || isPastPhase ? "text-[#4E90FF]" : "text-gray-400"
                  )}
                >
                  {phaseIcons[phase]}
                </div>
              </div>
              
              {/* Mobile view: connecting line after the circle */}
              {index < phases.length - 1 && (
                <div 
                  className={cn(
                    "block sm:hidden h-6 w-0.5 mt-2 mb-2",
                    index < currentPhaseIndex ? "bg-[#4E90FF]" : "bg-gray-200"
                  )}
                />
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
                phaseStatus === "In Review" ? "text-[#4E90FF]" :
                phaseStatus === "In Progress" ? "text-[#4E90FF]" : 
                phaseStatus === "Completed" ? "text-green-600" : 
                "text-gray-400"
              )}>
                {phaseStatus}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectTimeline;

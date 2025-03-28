
import React from 'react';
import { FileText, Mic, Image, Film, Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type ProjectPhase = 'Copywriting' | 'Voice-over' | 'Storyboard' | 'Animation' | 'Variations' | string;

const phases: ProjectPhase[] = ['Copywriting', 'Voice-over', 'Storyboard', 'Animation', 'Variations'];

interface ProjectTimelineProps {
  currentPhase: string;
}

const ProjectTimeline = ({ currentPhase }: ProjectTimelineProps) => {
  // Function to normalize phase names for comparison
  const normalizePhase = (phase: string): ProjectPhase => {
    // Strip emoji prefixes and trim whitespace for comparison
    const cleanPhase = phase?.replace(/[\u{1F300}-\u{1F6FF}]|[\u{2700}-\u{27BF}]/gu, '').trim();
    
    // Map of lowercase phase names to standardized phase names
    const phaseMap: Record<string, ProjectPhase> = {
      'copywriting': 'Copywriting',
      'voice-over': 'Voice-over',
      'voiceover': 'Voice-over',
      'storyboard': 'Storyboard',
      'animation': 'Animation',
      'variations': 'Variations',
    };
    
    const normalized = cleanPhase?.toLowerCase();
    return phaseMap[normalized] || phase;
  };

  const normalizedCurrentPhase = normalizePhase(currentPhase);
  
  // Find the index of the current phase
  const currentPhaseIndex = phases.findIndex(
    phase => normalizePhase(phase) === normalizedCurrentPhase
  );
  
  // Calculate completion percentage
  const completionPercentage = currentPhaseIndex >= 0 
    ? Math.round(((currentPhaseIndex + 1) / phases.length) * 100) 
    : 0;

  // Get icon for a phase
  const getPhaseIcon = (phase: ProjectPhase) => {
    switch (normalizePhase(phase)) {
      case 'Copywriting':
        return <FileText className="h-5 w-5" />;
      case 'Voice-over':
        return <Mic className="h-5 w-5" />;
      case 'Storyboard':
        return <Image className="h-5 w-5" />;
      case 'Animation':
        return <Film className="h-5 w-5" />;
      case 'Variations':
        return <Package className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  console.log('Current Phase:', currentPhase);
  console.log('Normalized Phase:', normalizedCurrentPhase);
  console.log('Current Phase Index:', currentPhaseIndex);
  console.log('Completion Percentage:', completionPercentage);

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
        <h3 className="text-lg font-semibold">Project Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{completionPercentage}% Complete</span>
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
            Current: {normalizedCurrentPhase || 'Not started'}
          </span>
        </div>
      </div>
      
      <Progress value={completionPercentage} className="h-2 mb-4" />
      
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {phases.map((phase, index) => {
          const isCurrentPhase = normalizePhase(phase) === normalizedCurrentPhase;
          const isPastPhase = currentPhaseIndex >= 0 && index <= currentPhaseIndex;
          
          return (
            <div 
              key={phase}
              className={`flex flex-col items-center p-3 rounded-md transition-colors ${
                isCurrentPhase 
                  ? 'bg-primary text-primary-foreground ring-2 ring-primary/50' 
                  : isPastPhase
                    ? 'bg-primary/20 text-foreground'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                {getPhaseIcon(phase)}
              </div>
              <span className="text-xs font-medium text-center">
                {phase === 'Voice-over' ? '🎙️ Voice-over' : 
                 phase === 'Copywriting' ? '📝 Copywriting' :
                 phase === 'Storyboard' ? '🖼️ Storyboard' :
                 phase === 'Animation' ? '🎞️ Animation' :
                 phase === 'Variations' ? '📦 Variations' : phase}
              </span>
              {isCurrentPhase && (
                <span className="mt-1 text-[10px] bg-primary-foreground text-primary px-1.5 py-0.5 rounded-full">
                  You are here
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

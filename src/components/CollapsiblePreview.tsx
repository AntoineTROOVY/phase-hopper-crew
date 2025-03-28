
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CollapsiblePreviewProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPhase: string;
  relevantPhase: string;
  projectStatus?: string | null;
}

const CollapsiblePreview = ({ 
  title, 
  icon, 
  children, 
  currentPhase, 
  relevantPhase,
  projectStatus
}: CollapsiblePreviewProps) => {
  // Check if this preview is relevant to the current phase
  const isCurrentPhasePreview = currentPhase.includes(relevantPhase);
  
  // State to track if the preview is open or closed
  const [isOpen, setIsOpen] = useState(isCurrentPhasePreview);

  // Determine the status of this preview based on phases and project status
  const determinePreviewStatus = () => {
    const lowerCurrentPhase = currentPhase.toLowerCase();
    const lowerRelevantPhase = relevantPhase.toLowerCase();
    const lowerProjectStatus = projectStatus?.toLowerCase() || '';
    
    // If the relevant phase is the current one
    if (lowerCurrentPhase.includes(lowerRelevantPhase)) {
      // Use project status for the current phase
      if (lowerProjectStatus.includes('review')) {
        return 'To Review';
      } else {
        return 'In Progress';
      }
    }
    
    // If the relevant phase comes before the current phase, it should be Approved
    const phases = ['copywriting', 'storyboard', 'animation'];
    const relevantPhaseIndex = phases.findIndex(p => lowerRelevantPhase.includes(p));
    const currentPhaseIndex = phases.findIndex(p => lowerCurrentPhase.includes(p));
    
    if (relevantPhaseIndex < currentPhaseIndex) {
      return 'Approved';
    }
    
    // Default to In Progress
    return 'In Progress';
  };
  
  const previewStatus = determinePreviewStatus();
  
  // Styles for different statuses
  const statusStyles = {
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'To Review': 'bg-amber-100 text-amber-800 border-amber-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200'
  };
  
  // Update open state if current phase changes
  useEffect(() => {
    setIsOpen(isCurrentPhasePreview);
  }, [currentPhase, isCurrentPhasePreview]);

  return (
    <Card className="mt-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2 justify-between w-full">
              <CardTitle className="text-lg flex items-center gap-2">
                {icon}
                {title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={statusStyles[previewStatus]}>
                  {previewStatus}
                </Badge>
                {isOpen ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsiblePreview;

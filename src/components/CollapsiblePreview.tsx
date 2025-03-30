
import React, { useState, useRef } from 'react';
import { Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CollapsiblePreviewProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  currentPhase: string;
  relevantPhase: string;
  projectStatus?: string | null;
  externalUrl?: string;
  projectId?: string;
  initialOpen?: boolean;
  highlightAction?: boolean;
}

const CollapsiblePreview = ({ 
  title, 
  icon, 
  children, 
  currentPhase, 
  relevantPhase,
  projectStatus,
  externalUrl,
  projectId,
  initialOpen = true,
  highlightAction = false
}: CollapsiblePreviewProps) => {
  const isVoiceOverPreview = relevantPhase.toLowerCase() === 'voice';
  const [isOpen, setIsOpen] = useState(initialOpen);
  
  const isCurrentPhasePreview = currentPhase.includes(relevantPhase);
  const [isApproved, setIsApproved] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const requiredHoldTime = 5000;
  const { toast } = useToast();

  const determinePreviewStatus = () => {
    // Get normalized lowercase versions for easier comparison
    const lowerCurrentPhase = currentPhase.toLowerCase();
    const lowerRelevantPhase = relevantPhase.toLowerCase();
    const lowerProjectStatus = projectStatus?.toLowerCase() || '';
    
    // Define the phase order for comparison
    const phases = ['copywriting', 'voice', 'storyboard', 'animation', 'variations'];
    
    // Get the index of the current phase and relevant phase
    const relevantPhaseIndex = phases.findIndex(p => lowerRelevantPhase.includes(p));
    const currentPhaseIndex = phases.findIndex(p => lowerCurrentPhase.includes(p));
    
    // Special case for Copywriting
    if (lowerRelevantPhase.includes('copy')) {
      // If we're in the same phase and status contains "approved"
      if (lowerCurrentPhase.includes('copy') && lowerProjectStatus.includes('approved')) {
        return 'Approved';
      }
      // If we've moved past copywriting to another phase
      else if (currentPhaseIndex > relevantPhaseIndex) {
        return 'Approved';
      }
      // If we're in the copywriting phase
      else if (lowerCurrentPhase.includes('copy')) {
        // In review status
        if (lowerProjectStatus.includes('review')) {
          return 'To Review';
        } 
        // Any other status (in progress, etc.)
        else {
          return 'In Progress';
        }
      }
    }
    // For all other phases (voice, storyboard, animation, variations)
    else {
      // If we're in the relevant phase
      if (lowerCurrentPhase.includes(lowerRelevantPhase)) {
        // In review status
        if (lowerProjectStatus.includes('review')) {
          return 'To Review';
        } 
        // Any other status (in progress, etc.)
        else {
          return 'In Progress';
        }
      }
      
      // If the relevant phase is before the current phase (we've passed it)
      if (relevantPhaseIndex < currentPhaseIndex) {
        return 'Approved';
      }
    }
    
    // Default fallback
    return 'In Progress';
  };
  
  const previewStatus = determinePreviewStatus();
  const isToReview = previewStatus === 'To Review';
  
  const statusStyles = {
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'To Review': 'bg-amber-100 text-amber-800 border-amber-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200'
  };

  const handleApprove = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is missing. Cannot update status.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from("PIPELINE PROJECTS")
        .update({ Status: "Approved" })
        .eq("ID-PROJET", projectId);

      if (error) {
        throw error;
      }

      setIsApproved(true);
      setHoldProgress(0);
      
      toast({
        title: "Success",
        description: `${relevantPhase} has been approved successfully.`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error updating project status:", error);
      toast({
        title: "Error",
        description: "Failed to update project status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const startHolding = () => {
    setIsHolding(true);
    const startTime = Date.now();
    
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current);
    }
    
    holdTimerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(100, (elapsedTime / requiredHoldTime) * 100);
      setHoldProgress(progress);
      
      if (progress >= 100) {
        stopHolding();
        handleApprove();
      }
    }, 100);
  };
  
  const stopHolding = () => {
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    setIsHolding(false);
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };
  
  React.useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        window.clearInterval(holdTimerRef.current);
      }
    };
  }, []);

  const getInstructions = () => {
    if (relevantPhase.toLowerCase().includes('storyboard')) {
      return "Suggest modifications directly on Figma by clicking the button above.";
    } else if (relevantPhase.toLowerCase().includes('copy')) {
      return "Suggest modifications directly on Google Docs by clicking the button above.";
    } else if (relevantPhase.toLowerCase().includes('animation')) {
      return "Suggest modifications directly on Frame.io by clicking the button above.";
    } else if (relevantPhase.toLowerCase().includes('variations')) {
      return "Suggest modifications directly by clicking the button above.";
    } else {
      return "Suggest modifications directly on the platform by clicking the button above.";
    }
  };

  const openExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (externalUrl) {
      window.open(externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const toggleCollapse = () => {
    if (isVoiceOverPreview) {
      setIsOpen(!isOpen);
    }
  };

  // Fix: Clone children only if they accept the props we want to pass
  const childrenWithProps = React.isValidElement(children) && isVoiceOverPreview
    ? React.cloneElement(children as React.ReactElement<any>, { 
        phase: currentPhase,
        status: projectStatus,
        projectId: projectId
      })
    : children;

  return (
    <Card className={`mt-6 ${isToReview ? 'border-2 border-amber-500' : ''} ${highlightAction ? 'border-2 border-amber-500 shadow-md shadow-amber-100' : ''}`}>
      <CardHeader 
        className={`py-4 ${isVoiceOverPreview ? 'cursor-pointer' : ''}`} 
        onClick={isVoiceOverPreview ? toggleCollapse : undefined}
      >
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {externalUrl && !isToReview && !isVoiceOverPreview && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:text-gray-700 mr-2"
                onClick={openExternalLink}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open
              </Button>
            )}
            <Badge variant="outline" className={statusStyles[previewStatus]}>
              {previewStatus}
            </Badge>
            {isVoiceOverPreview && (
              <button 
                className="ml-2 text-gray-500 hover:text-gray-700" 
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {(!isVoiceOverPreview || isOpen) && (
        <>
          <CardContent className="p-0">
            {isToReview && <p className="text-sm text-gray-500 mb-3 pt-2 px-6">{getInstructions()}</p>}
            <div className="w-full">
              {childrenWithProps}
            </div>
          </CardContent>
          {isToReview && !isApproved && (
            <CardFooter className="pb-6 pt-4 flex justify-between w-full px-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="bg-green-500 hover:bg-green-600 text-white flex-1 mr-2">
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to proceed to the next phase? This action is definitive. 
                      You will no longer be able to modify the {relevantPhase.toLowerCase()}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <div className="relative">
                      <AlertDialogAction
                        className="bg-white border border-green-500 text-green-600 hover:bg-green-50"
                        onMouseDown={startHolding}
                        onMouseUp={stopHolding}
                        onMouseLeave={stopHolding}
                        onTouchStart={startHolding}
                        onTouchEnd={stopHolding}
                        onClick={(e) => e.preventDefault()}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Updating...' : 'Hold to Approve'}
                      </AlertDialogAction>
                      <div 
                        className="absolute inset-0 bg-green-500 opacity-70 pointer-events-none rounded-md transition-all ease-linear" 
                        style={{ 
                          width: `${holdProgress}%`,
                          maxWidth: '100%'
                        }}
                      />
                    </div>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              {externalUrl && (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600 text-white flex-1 ml-2"
                  onClick={() => {
                    window.open(externalUrl, '_blank', 'noopener,noreferrer');
                  }}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Review
                </Button>
              )}
            </CardFooter>
          )}
        </>
      )}
    </Card>
  );
};

export default CollapsiblePreview;

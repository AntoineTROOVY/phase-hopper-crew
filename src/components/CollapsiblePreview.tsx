
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  // State to track if the component is approved
  const [isApproved, setIsApproved] = useState(false);
  // State for the hold-to-confirm button
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const requiredHoldTime = 5000; // 5 seconds in milliseconds

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
  const isToReview = previewStatus === 'To Review';
  
  // Styles for different statuses - removed hover effects
  const statusStyles = {
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'To Review': 'bg-amber-100 text-amber-800 border-amber-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200'
  };

  // Function to handle approval
  const handleApprove = () => {
    console.log(`Approved ${relevantPhase}`);
    setIsApproved(true);
    // Reset hold progress
    setHoldProgress(0);
    // Here we would normally send a request to update the project status
    // This will be implemented later
  };

  // Hold to confirm logic
  const startHolding = () => {
    setIsHolding(true);
    const startTime = Date.now();
    
    // Clear any existing timer
    if (holdTimerRef.current) {
      window.clearInterval(holdTimerRef.current);
    }
    
    // Set up progress update interval
    holdTimerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(100, (elapsedTime / requiredHoldTime) * 100);
      setHoldProgress(progress);
      
      // If completed holding for required time
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
    // Only reset progress if not completed
    if (holdProgress < 100) {
      setHoldProgress(0);
    }
  };
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (holdTimerRef.current) {
        window.clearInterval(holdTimerRef.current);
      }
    };
  }, []);
  
  // Update open state if current phase changes
  useEffect(() => {
    setIsOpen(isCurrentPhasePreview);
  }, [currentPhase, isCurrentPhasePreview]);

  return (
    <Card className={`mt-6 ${isToReview ? 'border-2 border-amber-500' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="py-4">
          <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
            <div className="flex items-center gap-2 justify-between w-full">
              <CardTitle className="text-lg flex items-center gap-2">
                {icon}
                {title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={statusStyles[previewStatus]}>
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
        <CollapsibleContent className="transition-all duration-300 ease-in-out">
          <CardContent className="py-6">
            {children}
          </CardContent>
          {isToReview && !isApproved && (
            <CardFooter className="pt-0 pb-6">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
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
                        onClick={(e) => e.preventDefault()} // Prevent default click action
                      >
                        Hold to Approve
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
            </CardFooter>
          )}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsiblePreview;

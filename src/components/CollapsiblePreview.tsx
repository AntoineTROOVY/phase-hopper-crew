
import React, { useState, useRef } from 'react';
import { Check, ExternalLink } from 'lucide-react';
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
  externalUrl?: string;
}

const CollapsiblePreview = ({ 
  title, 
  icon, 
  children, 
  currentPhase, 
  relevantPhase,
  projectStatus,
  externalUrl
}: CollapsiblePreviewProps) => {
  const isCurrentPhasePreview = currentPhase.includes(relevantPhase);
  
  const [isApproved, setIsApproved] = useState(false);
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<number | null>(null);
  const requiredHoldTime = 5000;

  const determinePreviewStatus = () => {
    const lowerCurrentPhase = currentPhase.toLowerCase();
    const lowerRelevantPhase = relevantPhase.toLowerCase();
    const lowerProjectStatus = projectStatus?.toLowerCase() || '';
    
    if (lowerCurrentPhase.includes(lowerRelevantPhase)) {
      if (lowerProjectStatus.includes('review')) {
        return 'To Review';
      } else {
        return 'In Progress';
      }
    }
    
    const phases = ['copywriting', 'storyboard', 'animation'];
    const relevantPhaseIndex = phases.findIndex(p => lowerRelevantPhase.includes(p));
    const currentPhaseIndex = phases.findIndex(p => lowerCurrentPhase.includes(p));
    
    if (relevantPhaseIndex < currentPhaseIndex) {
      return 'Approved';
    }
    
    return 'In Progress';
  };
  
  const previewStatus = determinePreviewStatus();
  const isToReview = previewStatus === 'To Review';
  
  const statusStyles = {
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    'To Review': 'bg-amber-100 text-amber-800 border-amber-200',
    'Approved': 'bg-green-100 text-green-800 border-green-200'
  };

  const handleApprove = () => {
    console.log(`Approved ${relevantPhase}`);
    setIsApproved(true);
    setHoldProgress(0);
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

  // Determine instructions based on relevant phase
  const getInstructions = () => {
    if (relevantPhase.toLowerCase().includes('storyboard')) {
      return "Suggest modifications directly on Figma by clicking the button above.";
    } else if (relevantPhase.toLowerCase().includes('copy')) {
      return "Suggest modifications directly on Google Docs by clicking the button above.";
    } else if (relevantPhase.toLowerCase().includes('animation')) {
      return "Suggest modifications directly on Frame.io by clicking the button above.";
    } else {
      return "Suggest modifications directly on the platform by clicking the button above.";
    }
  };

  return (
    <Card className={`mt-6 ${isToReview ? 'border-2 border-amber-500' : ''}`}>
      <CardHeader className="py-4">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="text-lg flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={statusStyles[previewStatus]}>
              {previewStatus}
            </Badge>
            {externalUrl && (
              <div className="flex items-center gap-1">
                {isToReview && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8 text-amber-600 border-amber-600 hover:bg-amber-50"
                    onClick={() => {
                      window.open(externalUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <span>Review</span>
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                )}
                {!isToReview && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={() => {
                      window.open(externalUrl, '_blank', 'noopener,noreferrer');
                    }}
                    title="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-gray-500 mb-4">{getInstructions()}</p>
        {children}
      </CardContent>
      {isToReview && !isApproved && (
        <CardFooter className="pb-6">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white w-full">
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
    </Card>
  );
};

export default CollapsiblePreview;


import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimationPreviewProps {
  animationUrl: string;
}

const AnimationPreview = ({ animationUrl }: AnimationPreviewProps) => {
  const openExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(animationUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="m-0 p-0">
      {animationUrl && (
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700"
            onClick={openExternalLink}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      )}
      <video 
        src={animationUrl} 
        controls 
        className="w-full rounded-md"
        onError={(e) => {
          console.error('Error loading animation preview:', e);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default AnimationPreview;

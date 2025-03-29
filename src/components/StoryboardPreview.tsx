
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StoryboardPreviewProps {
  storyboardUrl: string;
}

const StoryboardPreview = ({ storyboardUrl }: StoryboardPreviewProps) => {
  const openExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(storyboardUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="m-0 p-0">
      {storyboardUrl && (
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
      <img 
        src={storyboardUrl} 
        alt="Storyboard Preview" 
        className="max-w-full h-auto rounded-md"
        onError={(e) => {
          console.error('Error loading storyboard preview:', e);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default StoryboardPreview;

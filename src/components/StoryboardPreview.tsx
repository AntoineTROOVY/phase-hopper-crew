
import React from 'react';

interface StoryboardPreviewProps {
  storyboardUrl: string;
}

const StoryboardPreview = ({ storyboardUrl }: StoryboardPreviewProps) => {
  return (
    <div className="text-sm text-gray-700 mb-0">
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

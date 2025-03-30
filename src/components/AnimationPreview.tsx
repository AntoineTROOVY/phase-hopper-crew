
import React from 'react';

interface AnimationPreviewProps {
  animationUrl: string;
}

const AnimationPreview = ({ animationUrl }: AnimationPreviewProps) => {
  return (
    <div className="m-0 p-0">
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


import React from 'react';

interface StoryboardPreviewProps {
  storyboardUrl: string;
}

const StoryboardPreview = ({ storyboardUrl }: StoryboardPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      You can view the full storyboard by clicking the button above.
    </div>
  );
};

export default StoryboardPreview;

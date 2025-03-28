
import React from 'react';

interface StoryboardPreviewProps {
  storyboardUrl: string;
}

const StoryboardPreview = ({ storyboardUrl }: StoryboardPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      This storyboard is available externally. Click the link icon above to open the full storyboard.
    </div>
  );
};

export default StoryboardPreview;

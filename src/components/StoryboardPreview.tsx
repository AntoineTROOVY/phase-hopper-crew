
import React from 'react';

interface StoryboardPreviewProps {
  storyboardUrl: string;
}

const StoryboardPreview = ({ storyboardUrl }: StoryboardPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      Vous devez suggérer des modifications directement sur Figma. Cliquez au-dessus pour y accéder.
    </div>
  );
};

export default StoryboardPreview;

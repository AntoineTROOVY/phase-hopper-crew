
import React from 'react';

interface AnimationPreviewProps {
  animationUrl: string;
}

const AnimationPreview = ({ animationUrl }: AnimationPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      You can view the full animation by clicking the button above.
    </div>
  );
};

export default AnimationPreview;

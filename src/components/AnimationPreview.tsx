
import React from 'react';

interface AnimationPreviewProps {
  animationUrl: string;
}

const AnimationPreview = ({ animationUrl }: AnimationPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      This animation is available on Frame.io. Click the link icon above to open the full animation.
    </div>
  );
};

export default AnimationPreview;

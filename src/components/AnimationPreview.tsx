
import React from 'react';

interface AnimationPreviewProps {
  animationUrl: string;
}

const AnimationPreview = ({ animationUrl }: AnimationPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      Vous devez suggérer des modifications directement sur Frame.io. Cliquez au-dessus pour y accéder.
    </div>
  );
};

export default AnimationPreview;

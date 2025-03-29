
import React from 'react';

interface VariationsPreviewProps {
  variationsUrl: string;
}

const VariationsPreview = ({ variationsUrl }: VariationsPreviewProps) => {
  return (
    <div className="m-0 p-0">
      <video 
        src={variationsUrl} 
        controls 
        className="w-full rounded-md"
        onError={(e) => {
          console.error('Error loading variations preview:', e);
          e.currentTarget.style.display = 'none';
        }}
      />
    </div>
  );
};

export default VariationsPreview;

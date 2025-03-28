
import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="m-0 p-0">
      <iframe 
        src={scriptUrl} 
        title="Script Preview" 
        className="w-full h-48 rounded-md"
        onError={(e) => {
          console.error('Error loading script preview:', e);
        }}
      />
    </div>
  );
};

export default ScriptPreview;

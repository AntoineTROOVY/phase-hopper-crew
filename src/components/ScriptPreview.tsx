
import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      {/* Preview content would go here */}
    </div>
  );
};

export default ScriptPreview;

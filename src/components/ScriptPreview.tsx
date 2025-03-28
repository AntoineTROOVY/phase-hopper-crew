
import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      You can view the full script by clicking the button above.
    </div>
  );
};

export default ScriptPreview;

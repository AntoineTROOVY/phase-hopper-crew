
import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      This script is available externally. Click the link icon above to open the full script.
    </div>
  );
};

export default ScriptPreview;

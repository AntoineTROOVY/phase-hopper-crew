import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="m-0 p-0">
      {/* Script preview cannot be embedded directly */}
      {/* The Open button is now handled in the parent CollapsiblePreview component */}
    </div>
  );
};

export default ScriptPreview;

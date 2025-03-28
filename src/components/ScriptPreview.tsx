
import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="text-sm text-gray-700">
      Vous devez suggérer des modifications directement sur le Google Doc. Cliquez au-dessus pour y accéder.
    </div>
  );
};

export default ScriptPreview;

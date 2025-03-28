
import React from 'react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="m-0 p-0">
      <a 
        href={scriptUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block px-4 py-3 bg-gray-50 text-blue-600 hover:underline text-center rounded-md"
      >
        Open Script
      </a>
    </div>
  );
};

export default ScriptPreview;

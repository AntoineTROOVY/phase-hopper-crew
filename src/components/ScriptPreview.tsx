
import React from 'react';
import { FileText } from 'lucide-react';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 border rounded-md">
        <p className="text-sm text-gray-700">
          This script is available externally. Click the link icon above to open the full script.
        </p>
        <div className="flex items-center justify-center mt-4 p-6 bg-gray-100 rounded-md">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default ScriptPreview;

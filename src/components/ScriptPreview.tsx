
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  const openExternalLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(scriptUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="m-0 p-0">
      {scriptUrl && (
        <div className="flex justify-end mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-500 hover:text-gray-700"
            onClick={openExternalLink}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Open
          </Button>
        </div>
      )}
    </div>
  );
};

export default ScriptPreview;

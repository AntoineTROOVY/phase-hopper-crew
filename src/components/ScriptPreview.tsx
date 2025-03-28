
import React, { useState } from 'react';
import { FileText, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ScriptPreviewProps {
  scriptUrl: string;
}

const ScriptPreview = ({ scriptUrl }: ScriptPreviewProps) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border rounded-md overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          {!imageError ? (
            <img
              src="/placeholder.svg"
              alt="Script preview"
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <FileText className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </AspectRatio>
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-3">
            This script is available externally. Click below to view the full script.
          </p>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            asChild
          >
            <a 
              href={scriptUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              View Script
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScriptPreview;


import React, { useState } from 'react';
import { ExternalLink, Film, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface AnimationPreviewProps {
  animationUrl: string;
}

const AnimationPreview = ({ animationUrl }: AnimationPreviewProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Since we can't directly embed the Frame.io content, we'll show a placeholder
  // with a link to the actual content
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border rounded-md overflow-hidden">
        <AspectRatio ratio={16 / 9} className="bg-muted">
          {!imageError ? (
            <img
              src="/placeholder.svg"
              alt="Animation preview"
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <Film className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </AspectRatio>
        <div className="p-4">
          <p className="text-sm text-gray-700 mb-3">
            This animation is available on Frame.io. Click below to view the full animation.
          </p>
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex items-center gap-2"
            asChild
          >
            <a 
              href={animationUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              View on Frame.io
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimationPreview;

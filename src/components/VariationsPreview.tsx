
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface VariationsPreviewProps {
  variationsUrl: string;
}

const VariationsPreview = ({ variationsUrl }: VariationsPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
  }, [variationsUrl]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('Error loading variations preview:', e);
    setIsLoading(false);
    setHasError(true);
  };

  // If URL is empty, don't render anything
  if (!variationsUrl) {
    return null;
  }

  return (
    <div className="m-0 p-0 relative min-h-[200px] bg-gray-50 rounded-md">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-center p-4">
          <p className="text-gray-500">
            Unable to load video preview. The video might be unavailable or the format is unsupported.
          </p>
        </div>
      )}
      
      <video 
        src={variationsUrl} 
        controls 
        className={`w-full rounded-md ${isLoading ? 'invisible' : 'visible'}`}
        onLoadedData={handleLoad}
        onError={handleError}
        preload="metadata"
      />
    </div>
  );
};

export default VariationsPreview;


import React from 'react';
import { Image } from 'lucide-react';

interface StoryboardPreviewProps {
  storyboardUrl: string;
}

const StoryboardPreview = ({ storyboardUrl }: StoryboardPreviewProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 border rounded-md">
        <p className="text-sm text-gray-700">
          This storyboard is available externally. Click the link icon above to open the full storyboard.
        </p>
        <div className="flex items-center justify-center mt-4 p-6 bg-gray-100 rounded-md">
          <Image className="h-12 w-12 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default StoryboardPreview;

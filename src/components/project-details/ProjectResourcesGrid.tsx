import React from 'react';
import { FileText, File, Image, Mic, Film, Package, ExternalLink } from 'lucide-react';

const resources = [
  {
    key: 'Brief main',
    label: 'Brief document',
    icon: <File className="h-8 w-8 text-red-500" />,
  },
  {
    key: 'Script',
    label: 'Script',
    icon: <FileText className="h-8 w-8 text-blue-500" />,
  },
  {
    key: 'Storyboard',
    label: 'Storyboard',
    icon: <Image className="h-8 w-8 text-purple-500" />,
  },
  {
    key: 'Voice-file-url',
    label: 'Voice-Over',
    icon: <Mic className="h-8 w-8 text-gray-700" />,
  },
  {
    key: 'Animation',
    label: 'Animation',
    icon: <Film className="h-8 w-8 text-gray-700" />,
  },
  {
    key: 'Variations-url',
    label: 'Déclinaisons',
    icon: <Package className="h-8 w-8 text-orange-500" />,
  },
];

const ProjectResourcesGrid = ({ project }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {resources.map((res) => {
        const url = project[res.key];
        const isAvailable = !!url && url !== '';
        return (
          <div
            key={res.key}
            className={`rounded-xl border p-4 flex flex-col items-center justify-center transition ${isAvailable ? 'bg-white hover:shadow-lg cursor-pointer' : 'bg-gray-50 opacity-60 cursor-not-allowed'}`}
            onClick={() => isAvailable && window.open(url, '_blank', 'noopener,noreferrer')}
            style={{ pointerEvents: isAvailable ? 'auto' : 'none' }}
          >
            <div className="mb-2">{res.icon}</div>
            <div className="font-semibold mb-1 flex items-center gap-1">
              {res.label}
              {isAvailable && <ExternalLink className="h-4 w-4 inline-block text-gray-400" />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectResourcesGrid; 
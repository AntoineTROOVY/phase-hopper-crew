
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AudioPlayer from './AudioPlayer';
import VoiceOverSelectionModal from './VoiceOverSelectionModal';
import { parseVoiceFileUrl } from './voiceUtils';

interface VoiceOverPreviewProps {
  voiceFileUrl: string;
  phase?: string;
  status?: string;
  projectId?: string;
  languages?: string;
}

const VoiceOverPreview = ({
  voiceFileUrl,
  phase,
  status,
  projectId,
  languages
}: VoiceOverPreviewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVoiceOverPrompt, setShowVoiceOverPrompt] = useState(true);
  
  const audioFiles = parseVoiceFileUrl(voiceFileUrl);
  
  const isVoiceOverPhaseNotStarted = 
    phase?.toLowerCase().includes('voice') && 
    status?.toLowerCase().includes('not') && 
    status?.toLowerCase().includes('start') && 
    !audioFiles.length;

  const isVoiceOverPhaseInProgress = 
    phase?.toLowerCase().includes('voice') && 
    status?.toLowerCase().includes('in progress') && 
    !audioFiles.length;

  const handleSelectionComplete = () => {
    setShowVoiceOverPrompt(false);
  };

  if (isVoiceOverPhaseNotStarted && showVoiceOverPrompt) {
    return (
      <>
        <div className="p-4 border-2 border-amber-500 rounded-md m-3 bg-amber-50">
          <p className="text-amber-800 font-medium mb-4">
            You need to select a VoiceOver for your project
          </p>
          <Button 
            className="bg-primary text-white"
            onClick={() => setIsModalOpen(true)}
          >
            Select a VoiceOver
          </Button>
        </div>
        
        <VoiceOverSelectionModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          projectId={projectId}
          languages={languages}
          onSelectionComplete={handleSelectionComplete}
        />
      </>
    );
  }
  
  if (isVoiceOverPhaseInProgress) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">
          Your voice-overs are currently being recorded. They'll be available here very soon.
        </p>
      </div>
    );
  }
  
  if (!audioFiles.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No voice-over files available
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="space-y-2">
        {audioFiles.map((file, index) => (
          <AudioPlayer key={index} url={file.url} filename={file.filename} />
        ))}
      </div>
    </div>
  );
};

export default VoiceOverPreview;

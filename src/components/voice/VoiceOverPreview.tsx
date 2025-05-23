import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AudioPlayer from './AudioPlayer';
import VoiceOverSelectionModal from './VoiceOverSelectionModal';
import { parseVoiceFileUrl } from './voiceUtils';

interface VoiceOverPreviewProps {
  voiceFileUrl?: string;
  voiceFile?: any[] | null;
  phase?: string;
  status?: string;
  projectId?: string;
  languages?: string;
}

const VoiceOverPreview = ({
  voiceFileUrl,
  voiceFile,
  phase,
  status,
  projectId,
  languages
}: VoiceOverPreviewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVoiceOverPrompt, setShowVoiceOverPrompt] = useState(true);
  const [projectLanguages, setProjectLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  
  useEffect(() => {
    if (languages) {
      const languageArray = languages.split(',').map(lang => lang.trim());
      setProjectLanguages(languageArray);
      
      // Si une seule langue est disponible, la sélectionner automatiquement
      if (languageArray.length === 1) {
        setSelectedLanguage(languageArray[0]);
      }
    }
  }, [languages]);
  
  let audioFiles: { url: string; filename: string }[] = [];
  if (voiceFile && Array.isArray(voiceFile) && voiceFile.length > 0) {
    audioFiles = voiceFile.map((att: any) => ({
      url: att.url,
      filename: att.filename
    })).filter(file => file.url && file.filename);
  } else {
    audioFiles = parseVoiceFileUrl(voiceFileUrl || '');
  }
  
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

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
  };

  const handleOpenVoiceOverModal = () => {
    if (selectedLanguage || projectLanguages.length === 1) {
      setIsModalOpen(true);
    }
  };

  if (isVoiceOverPhaseNotStarted && showVoiceOverPrompt) {
    return (
      <>
        <div className="p-4 border-2 border-amber-500 rounded-md m-3 bg-amber-50">
          <p className="text-amber-800 font-medium mb-4">
            You need to select a VoiceOver for your project
          </p>
          
          {projectLanguages.length > 1 && (
            <div className="mb-4">
              <label className="text-sm font-medium block mb-2">Select a language first:</label>
              <Select onValueChange={handleLanguageChange} value={selectedLanguage || ""}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {projectLanguages.map((language) => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <Button 
            className="bg-primary text-white"
            onClick={handleOpenVoiceOverModal}
            disabled={projectLanguages.length > 1 && !selectedLanguage}
          >
            Select a VoiceOver
          </Button>
        </div>
        
        <VoiceOverSelectionModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          projectId={projectId}
          languages={selectedLanguage || languages}
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

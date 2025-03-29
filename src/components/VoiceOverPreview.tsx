
import React from 'react';
import { Headphones, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceOverPreviewProps {
  voiceFileUrl: string;
}

interface AudioFile {
  url: string;
  filename: string;
}

const AudioPlayer = ({ url, filename }: AudioFile) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const [isMuted, setIsMuted] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  const updateProgress = () => {
    if (audioRef.current) {
      const value = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center">
          <Headphones className="h-5 w-5 mr-2 text-gray-500" />
          <span className="text-sm font-medium truncate" title={filename}>
            {filename}
          </span>
        </div>
      </div>
      
      <audio 
        ref={audioRef}
        src={url}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Error loading audio:', e);
        }}
        className="hidden"
      />
      
      <div className="flex flex-col space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-orange-500 h-2.5 rounded-full transition-all" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between">
          <Button 
            onClick={togglePlay}
            variant="ghost"
            size="sm"
            className="text-gray-700"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <div className="flex items-center">
            <Button 
              onClick={toggleMute}
              variant="ghost"
              size="sm"
              className="text-gray-700"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const VoiceOverPreview = ({ voiceFileUrl }: VoiceOverPreviewProps) => {
  const parseVoiceFileUrl = (urlString: string): AudioFile[] => {
    if (!urlString) return [];
    
    // Split by Record Separator (␞)
    const entries = urlString.split('␞');
    
    return entries.map(entry => {
      // Split each entry by Unit Separator (␟)
      const [filename, url] = entry.split('␟');
      return { url, filename };
    }).filter(file => file.url && file.filename);
  };

  const audioFiles = parseVoiceFileUrl(voiceFileUrl);

  if (!audioFiles.length) {
    return (
      <div className="p-4 text-center text-gray-500">
        No voice-over files available
      </div>
    );
  }

  return (
    <div className="p-0">
      {audioFiles.map((file, index) => (
        <AudioPlayer key={index} url={file.url} filename={file.filename} />
      ))}
    </div>
  );
};

export default VoiceOverPreview;

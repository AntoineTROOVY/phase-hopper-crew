
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, ChevronDown, Headphones } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface VoiceOverPreviewProps {
  voiceFileUrl: string;
}

interface AudioFile {
  url: string;
  filename: string;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const AudioPlayer = ({
  url,
  filename
}: AudioFile) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const waveformRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateDuration = () => {
        if (!isNaN(audio.duration)) {
          setDuration(audio.duration);
        }
      };
      audio.addEventListener('loadedmetadata', updateDuration);
      return () => audio.removeEventListener('loadedmetadata', updateDuration);
    }
  }, []);

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

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const updateProgress = () => {
    if (audioRef.current) {
      const value = audioRef.current.currentTime / audioRef.current.duration * 100;
      setProgress(value);
    }
  };

  const seekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && waveformRef.current) {
      const rect = waveformRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const seekTime = audioRef.current.duration * clickPosition;
      audioRef.current.currentTime = seekTime;
      setProgress(clickPosition * 100);
    }
  };

  return <div className="bg-white rounded-lg p-3 mb-4 border border-gray-100">
      <div className="text-sm font-medium text-gray-700 mb-2 truncate" title={filename}>
        {filename}
      </div>
      
      <audio ref={audioRef} src={url} onTimeUpdate={updateProgress} onEnded={() => setIsPlaying(false)} onError={e => {
      console.error('Error loading audio:', e);
    }} className="hidden" />
      
      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button onClick={togglePlay} className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300" aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        
        {/* Waveform with color-changing bars */}
        <div ref={waveformRef} className="flex-grow relative h-10 cursor-pointer bg-gray-50 rounded overflow-hidden" onClick={seekAudio}>
          <div className="absolute inset-0 flex items-center justify-around px-1">
            {[...Array(50)].map((_, i) => {
            // Create a pattern of varying heights
            const height = 30 + Math.sin(i * 0.2) * 20 + Math.random() * 15;
            // Determine if this bar is part of the played portion
            const isPlayed = i / 50 * 100 <= progress;
            return <div key={i} className={`w-[3px] ${isPlayed ? 'bg-blue-500' : 'bg-gray-300'}`} style={{
              height: `${height}%`
            }} />;
          })}
          </div>
        </div>
        
        {/* Volume Control and Duration */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <Volume2 className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-10 p-2" side="top">
              <div className="h-24">
                <Slider defaultValue={[volume]} max={1} step={0.01} orientation="vertical" onValueChange={handleVolumeChange} className="h-full" />
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="text-xs text-gray-500 w-10 text-right">
            {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>;
};

const VoiceOverPreview = ({
  voiceFileUrl
}: VoiceOverPreviewProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const parseVoiceFileUrl = (urlString: string): AudioFile[] => {
    if (!urlString) return [];

    // Split by Record Separator (␞)
    const entries = urlString.split('␞');
    return entries.map(entry => {
      // Split each entry by Unit Separator (␟)
      const [filename, url] = entry.split('␟');
      return {
        url,
        filename
      };
    }).filter(file => file.url && file.filename);
  };

  const audioFiles = parseVoiceFileUrl(voiceFileUrl);

  if (!audioFiles.length) {
    return <div className="p-4 text-center text-gray-500">
        No voice-over files available
      </div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 bg-white cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Headphones className="h-5 w-5 text-blue-500" />
          <h3 className="font-medium">Voice-Over Preview</h3>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Approved
          </span>
        </div>
        <ChevronDown 
          className={`h-5 w-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
        />
      </div>
      
      {isOpen && (
        <div className="p-3">
          {audioFiles.map((file, index) => (
            <AudioPlayer key={index} url={file.url} filename={file.filename} />
          ))}
        </div>
      )}
    </div>
  );
};

export default VoiceOverPreview;

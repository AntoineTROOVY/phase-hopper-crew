
import React, { useState } from 'react';
import { Play, Pause, Volume2, Headphones, Filter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface VoiceOverPreviewProps {
  voiceFileUrl: string;
  phase?: string;
  status?: string;
}

interface AudioFile {
  url: string;
  filename: string;
}

interface VoiceOver {
  Name: string;
  "Profil pic": string;
  Gender: string;
  Language: string;
  Preview: string;
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

  React.useEffect(() => {
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

  return (
    <div className="bg-white rounded-lg p-3 mb-4 border border-gray-100">
      <div className="text-sm font-medium text-gray-700 mb-2 truncate" title={filename}>
        {filename}
      </div>
      
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={updateProgress}
        onEnded={() => setIsPlaying(false)}
        onError={e => {
          console.error('Error loading audio:', e);
        }}
        className="hidden"
      />
      
      <div className="flex items-center gap-2">
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>
        
        <div
          ref={waveformRef}
          className="flex-grow relative h-10 cursor-pointer bg-gray-50 rounded overflow-hidden"
          onClick={seekAudio}
        >
          <div className="absolute inset-0 flex items-center justify-around px-1">
            {[...Array(50)].map((_, i) => {
              const height = 30 + Math.sin(i * 0.2) * 20 + Math.random() * 15;
              const isPlayed = i / 50 * 100 <= progress;
              return (
                <div
                  key={i}
                  className={`w-[3px] ${isPlayed ? 'bg-blue-500' : 'bg-gray-300'}`}
                  style={{
                    height: `${height}%`
                  }}
                />
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-3 flex-shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <Volume2 className="h-5 w-5" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-10 p-2" side="top">
              <div className="h-24">
                <Slider
                  defaultValue={[volume]}
                  max={1}
                  step={0.01}
                  orientation="vertical"
                  onValueChange={handleVolumeChange}
                  className="h-full"
                />
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="text-xs text-gray-500 w-10 text-right">
            {formatTime(duration)}
          </div>
        </div>
      </div>
    </div>
  );
};

const VoiceOverSelectionModal = ({ 
  open, 
  onOpenChange 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
}) => {
  const [voiceOvers, setVoiceOvers] = useState<VoiceOver[]>([]);
  const [filteredVoiceOvers, setFilteredVoiceOvers] = useState<VoiceOver[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    const fetchVoiceOvers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('Voice-overs')
          .select('*');
        
        if (error) {
          console.error('Error fetching voice overs:', error);
          return;
        }
        
        setVoiceOvers(data || []);
        setFilteredVoiceOvers(data || []);
      } catch (err) {
        console.error('Failed to fetch voice overs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      fetchVoiceOvers();
    }
  }, [open]);

  React.useEffect(() => {
    let filtered = [...voiceOvers];
    
    if (languageFilter) {
      filtered = filtered.filter(vo => vo.Language === languageFilter);
    }
    
    if (genderFilter) {
      filtered = filtered.filter(vo => vo.Gender === genderFilter);
    }
    
    setFilteredVoiceOvers(filtered);
  }, [languageFilter, genderFilter, voiceOvers]);

  const handleSelectVoiceOver = (voiceOver: VoiceOver) => {
    // To be implemented later with backend logic
    console.log('Selected voice over:', voiceOver);
    // For now, just close the modal
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Select a Voice-Over</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <div className="flex-1 min-w-[160px]">
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Languages</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="English UK">English UK</SelectItem>
                  <SelectItem value="English US">English US</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1 min-w-[160px]">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Genders</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="text-center py-8">
              <p>Loading voice-overs...</p>
            </div>
          ) : filteredVoiceOvers.length === 0 ? (
            <div className="text-center py-8">
              <p>No voice-overs found with the selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredVoiceOvers.map((voiceOver, index) => (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center gap-4 mb-3">
                    {voiceOver["Profil pic"] && (
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={voiceOver["Profil pic"]} 
                          alt={voiceOver.Name} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100?text=VO';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{voiceOver.Name}</h3>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">
                          {voiceOver.Gender}
                        </Badge>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-100">
                          {voiceOver.Language}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => handleSelectVoiceOver(voiceOver)}
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Select
                    </Button>
                  </div>
                  
                  {voiceOver.Preview && (
                    <AudioPlayer url={voiceOver.Preview} filename={`${voiceOver.Name} - Preview`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const VoiceOverPreview = ({
  voiceFileUrl,
  phase,
  status
}: VoiceOverPreviewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const parseVoiceFileUrl = (urlString: string): AudioFile[] => {
    if (!urlString) return [];

    const entries = urlString.split('␞');
    return entries.map(entry => {
      const [filename, url] = entry.split('␟');
      return {
        url,
        filename
      };
    }).filter(file => file.url && file.filename);
  };
  
  const audioFiles = parseVoiceFileUrl(voiceFileUrl);
  const isVoiceOverPhase = phase?.toLowerCase().includes('voice');
  const isNotStarted = status?.toLowerCase().includes('not started');
  const showVoiceOverSelection = isVoiceOverPhase && isNotStarted && audioFiles.length === 0;
  
  if (showVoiceOverSelection) {
    return (
      <div className="p-3">
        <div className="border-2 border-orange-300 bg-orange-50 rounded-lg p-6">
          <div className="text-center">
            <Headphones className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">You need to select a Voice-Over for your project</h3>
            <p className="text-gray-600 mb-6">Choose a voice that best represents your brand and project requirements.</p>
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              Select a Voice-Over
            </Button>
          </div>
        </div>
        
        <VoiceOverSelectionModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />
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

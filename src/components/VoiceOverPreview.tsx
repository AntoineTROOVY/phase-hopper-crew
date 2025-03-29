
import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, X, Filter } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

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
  Gender: string;
  Language: string;
  "Profil pic": string;
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

const VoiceOverSelectionModal = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const [voiceOvers, setVoiceOvers] = useState<VoiceOver[]>([]);
  const [filteredVoiceOvers, setFilteredVoiceOvers] = useState<VoiceOver[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVoiceOvers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('Voice-overs')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        setVoiceOvers(data || []);
        setFilteredVoiceOvers(data || []);
      } catch (error) {
        console.error('Error fetching voice-overs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchVoiceOvers();
    }
  }, [open]);

  useEffect(() => {
    let result = [...voiceOvers];
    
    if (languageFilter) {
      result = result.filter(vo => vo.Language === languageFilter);
    }
    
    if (genderFilter) {
      result = result.filter(vo => vo.Gender === genderFilter);
    }
    
    setFilteredVoiceOvers(result);
  }, [languageFilter, genderFilter, voiceOvers]);

  const handleLanguageChange = (value: string) => {
    setLanguageFilter(value === "all" ? null : value);
  };

  const handleGenderChange = (value: string) => {
    setGenderFilter(value === "all" ? null : value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Select a Voice-Over</DialogTitle>
        </DialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Language</label>
              <Select onValueChange={handleLanguageChange} defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="English UK">English UK</SelectItem>
                  <SelectItem value="English US">English US</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Gender</label>
              <RadioGroup 
                onValueChange={handleGenderChange} 
                defaultValue="all"
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <label htmlFor="all" className="text-sm">All</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Male" id="male" />
                  <label htmlFor="male" className="text-sm">Male</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Female" id="female" />
                  <label htmlFor="female" className="text-sm">Female</label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="mb-2">Loading voice-overs...</div>
          </div>
        ) : filteredVoiceOvers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No voice-overs match your filter criteria
          </div>
        ) : (
          <div className="space-y-4">
            {filteredVoiceOvers.map((voiceOver, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex items-center mb-3">
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={voiceOver["Profil pic"]} alt={voiceOver.Name} />
                    <AvatarFallback>{voiceOver.Name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{voiceOver.Name}</h3>
                    <div className="flex text-sm text-gray-500 space-x-2">
                      <span>{voiceOver.Gender}</span>
                      <span>•</span>
                      <span>{voiceOver.Language}</span>
                    </div>
                  </div>
                  <Button 
                    className="ml-auto" 
                    variant="outline"
                    onClick={() => {
                      console.log('Selected voice-over:', voiceOver.Name);
                      // This will be implemented later
                    }}
                  >
                    Select
                  </Button>
                </div>
                
                {voiceOver.Preview && (
                  <AudioPlayer 
                    url={voiceOver.Preview} 
                    filename={`${voiceOver.Name} (Preview)`} 
                  />
                )}
              </div>
            ))}
          </div>
        )}
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
  
  // Special case: Voice-over phase with Not started status and no files
  const isVoiceOverPhaseNotStarted = 
    phase?.toLowerCase().includes('voice') && 
    status?.toLowerCase().includes('not') && 
    status?.toLowerCase().includes('start') && 
    !audioFiles.length;

  if (isVoiceOverPhaseNotStarted) {
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
        />
      </>
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

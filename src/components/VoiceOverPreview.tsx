
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';

interface VoiceOverPreviewProps {
  voiceFileUrl?: string;
  phase?: string;
  status?: string | null;
}

interface VoiceOver {
  id: string;
  name: string;
  profile_pic: string;
  gender: string;
  language: string;
  preview_url: string;
}

const VoiceOverPreview = ({ voiceFileUrl, phase, status }: VoiceOverPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [voiceOvers, setVoiceOvers] = useState<VoiceOver[]>([]);
  const [filteredVoiceOvers, setFilteredVoiceOvers] = useState<VoiceOver[]>([]);
  const [language, setLanguage] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Check if we're in the Voice-over phase with Not started status
  const isVoiceOverSelectionNeeded = 
    phase?.toLowerCase().includes('voice') && 
    status?.toLowerCase() === 'not started';

  const fetchVoiceOvers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('Voice-overs')
        .select('*');
      
      if (error) throw error;
      
      setVoiceOvers(data || []);
      setFilteredVoiceOvers(data || []);
    } catch (error) {
      console.error('Error fetching voice-overs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    fetchVoiceOvers();
    setIsOpen(true);
  };

  const filterVoiceOvers = () => {
    let filtered = [...voiceOvers];
    
    if (language) {
      filtered = filtered.filter(vo => vo.language === language);
    }
    
    if (gender) {
      filtered = filtered.filter(vo => vo.gender === gender);
    }
    
    setFilteredVoiceOvers(filtered);
  };

  React.useEffect(() => {
    filterVoiceOvers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language, gender, voiceOvers]);

  if (isVoiceOverSelectionNeeded) {
    return (
      <div className="border-2 border-amber-500 rounded-md p-6 bg-amber-50">
        <p className="text-amber-800 mb-4">You need to select a VoiceOver for your project</p>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleOpenModal}
        >
          Select a VoiceOver
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Select a Voice-Over</DialogTitle>
            </DialogHeader>
            
            <div className="flex gap-4 mb-6">
              <div className="w-1/2">
                <label className="text-sm font-medium mb-1 block">Language</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
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
              <div className="w-1/2">
                <label className="text-sm font-medium mb-1 block">Gender</label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
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
            
            {loading ? (
              <div className="py-8 text-center">Loading voice-overs...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredVoiceOvers.length > 0 ? filteredVoiceOvers.map((voiceOver) => (
                  <div key={voiceOver.id} className="border rounded-md p-4">
                    <div className="flex gap-3 mb-3">
                      {voiceOver.profile_pic && (
                        <img 
                          src={voiceOver.profile_pic} 
                          alt={voiceOver.name} 
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{voiceOver.name}</h3>
                        <div className="flex gap-2 text-sm text-gray-500">
                          <span>{voiceOver.gender}</span>
                          <span>•</span>
                          <span>{voiceOver.language}</span>
                        </div>
                      </div>
                    </div>
                    
                    {voiceOver.preview_url && (
                      <audio 
                        src={voiceOver.preview_url} 
                        controls 
                        className="w-full mb-3"
                      />
                    )}
                    
                    <Button className="w-full">Select</Button>
                  </div>
                )) : (
                  <div className="col-span-2 py-8 text-center text-gray-500">
                    No voice-overs found matching your filters.
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (!voiceFileUrl) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No voice-over file is available yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <audio src={voiceFileUrl} controls className="w-full" />
    </div>
  );
};

export default VoiceOverPreview;

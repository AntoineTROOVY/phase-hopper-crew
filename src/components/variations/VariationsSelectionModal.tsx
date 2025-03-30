
import React, { useState, useEffect } from 'react';
import { Package, Check, AlertCircle, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import VoiceOverSelectionModal from '@/components/voice/VoiceOverSelectionModal';

interface AspectRatioOption {
  id: string;
  name: string;
  ratio: number;
  description: string;
  image: string;
}

interface LanguageSelection {
  language: string;
  selectedRatio: string | null;
  voiceOver: string | null;
}

interface VariationsSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  languages?: string;
  onSelectionComplete?: () => void;
}

const aspectRatioOptions: AspectRatioOption[] = [
  { 
    id: 'square', 
    name: 'Square (1:1)', 
    ratio: 1, 
    description: 'Perfect for Instagram posts and profile pictures',
    image: 'https://i.ibb.co/3q2D9ZH/1-1.png'
  },
  { 
    id: 'portrait_2_3', 
    name: 'Portrait (2:3)', 
    ratio: 2/3, 
    description: 'Optimized for Pinterest pins and some mobile formats',
    image: 'https://i.ibb.co/4ZHT9WKv/2-3.png'
  },
  { 
    id: 'portrait_4_5', 
    name: 'Portrait (4:5)', 
    ratio: 4/5, 
    description: 'Great for Instagram and Facebook photos',
    image: 'https://i.ibb.co/fgK0Kpw/4-5.png'
  },
  { 
    id: 'portrait_9_16', 
    name: 'Portrait (9:16)', 
    ratio: 9/16, 
    description: 'Ideal for Stories, Reels, and TikTok',
    image: 'https://i.ibb.co/Hp2Cwr8t/9-16.png'
  },
  { 
    id: 'landscape_16_9', 
    name: 'Landscape (16:9)', 
    ratio: 16/9, 
    description: 'Standard for YouTube, presentations, and websites',
    image: 'https://i.ibb.co/nMS0H8g9/16-9.png'
  }
];

const availableLanguages = [
  'French',
  'English',
  'Italian',
  'Spanish',
  'Arabic',
  'Dutch',
  'German'
];

const VariationsSelectionModal = ({ 
  open, 
  onOpenChange, 
  projectId, 
  languages,
  onSelectionComplete 
}: VariationsSelectionModalProps) => {
  const [languageSelections, setLanguageSelections] = useState<LanguageSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addLanguageOpen, setAddLanguageOpen] = useState(false);
  const [selectedNewLanguage, setSelectedNewLanguage] = useState<string | null>(null);
  const [voiceOverModalOpen, setVoiceOverModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (languages) {
      const languageArray = languages.split(',').map(lang => lang.trim());
      setLanguageSelections(
        languageArray.map(language => ({
          language,
          selectedRatio: null,
          voiceOver: null
        }))
      );
    }
  }, [languages]);

  const handleRatioSelection = (language: string, ratioId: string) => {
    setLanguageSelections(prev => 
      prev.map(item => 
        item.language === language 
          ? { ...item, selectedRatio: ratioId } 
          : item
      )
    );
  };

  const handleAddLanguage = () => {
    if (!selectedNewLanguage) return;
    
    // Check if language already exists
    if (languageSelections.some(item => item.language === selectedNewLanguage)) {
      toast({
        title: "Language already added",
        description: `${selectedNewLanguage} is already in your selections.`,
        variant: "destructive"
      });
      return;
    }

    setLanguageSelections(prev => [
      ...prev, 
      { 
        language: selectedNewLanguage, 
        selectedRatio: null,
        voiceOver: null
      }
    ]);
    
    setAddLanguageOpen(false);
    setSelectedNewLanguage(null);
  };

  const handleOpenVoiceOverModal = (language: string) => {
    setCurrentLanguage(language);
    setVoiceOverModalOpen(true);
  };

  // Handle voice-over selection without HTTP request
  const handleVoiceOverSelected = (voiceName: string) => {
    if (!currentLanguage) return;

    setLanguageSelections(prev => 
      prev.map(item => 
        item.language === currentLanguage 
          ? { ...item, voiceOver: voiceName } 
          : item
      )
    );
    setVoiceOverModalOpen(false);
  };

  const handleRemoveLanguage = (language: string) => {
    // Only allow removing added languages, not original ones
    if (languages && languages.split(',').map(lang => lang.trim()).includes(language)) {
      toast({
        title: "Cannot remove",
        description: "You cannot remove languages from the original project.",
        variant: "destructive"
      });
      return;
    }

    setLanguageSelections(prev => prev.filter(item => item.language !== language));
  };

  const handleSubmit = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is missing. Cannot submit selection.",
        variant: "destructive"
      });
      return;
    }

    // Check if all languages have a selection and voice over
    const incomplete = languageSelections.some(item => !item.selectedRatio || (!item.voiceOver && isLanguageAddedByClient(item.language)));
    
    if (incomplete) {
      setError("Please select an aspect ratio and voice-over for each language.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare payload with project ID and selected aspect ratios
      const payload = {
        "ID-PROJET": projectId,
        "variations": languageSelections.map(item => ({
          language: item.language,
          aspectRatio: item.selectedRatio,
          voiceOver: item.voiceOver
        }))
      };

      // In a real implementation, this would send data to a backend
      console.log("Variations submission payload:", payload);
      
      // Simulate API call with timeout
      setTimeout(() => {
        toast({
          title: "Variations requested",
          description: "Your aspect ratio variations have been requested successfully.",
          variant: "default"
        });

        onOpenChange(false);
        
        if (onSelectionComplete) {
          onSelectionComplete();
        }
        
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting variation selection:', error);
      setError("Failed to submit your variation selections. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isRatioSelected = (language: string, ratioId: string) => {
    const selection = languageSelections.find(item => item.language === language);
    return selection?.selectedRatio === ratioId;
  };

  const getSelectedLanguages = () => {
    return languageSelections.map(item => item.language);
  };

  const getAvailableLanguages = () => {
    const selectedLanguages = getSelectedLanguages();
    return availableLanguages.filter(lang => !selectedLanguages.includes(lang));
  };

  // Helper to determine if a language was added by the client
  const isLanguageAddedByClient = (language: string) => {
    if (!languages) return true; // If no original languages, all are added
    const originalLanguages = languages.split(',').map(lang => lang.trim());
    return !originalLanguages.includes(language);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Select Variations</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Select one aspect ratio variation for each language. For additional languages, you'll need to select a voice-over as well.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">Select format and voice-over for each language:</h3>
            <p className="text-sm text-blue-600">
              These additional formats will be created alongside your main video.
            </p>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-6">
            {languageSelections.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">{item.language}</h3>
                  {isLanguageAddedByClient(item.language) && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveLanguage(item.language)}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Remove
                    </Button>
                  )}
                </div>

                {/* Voice-Over Selection - Only visible for client-added languages */}
                {isLanguageAddedByClient(item.language) && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium">Voice-Over Selection</h4>
                      <Button 
                        variant={item.voiceOver ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleOpenVoiceOverModal(item.language)}
                      >
                        {item.voiceOver ? "Change Voice" : "Select Voice"}
                      </Button>
                    </div>
                    {item.voiceOver ? (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
                        <p>Selected voice: <span className="font-medium">{item.voiceOver}</span></p>
                      </div>
                    ) : (
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-gray-500">
                        No voice-over selected
                      </div>
                    )}
                  </div>
                )}
                
                <h4 className="font-medium mb-2">Format Selection</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aspectRatioOptions.map((ratio) => (
                    <div 
                      key={ratio.id}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        isRatioSelected(item.language, ratio.id) 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => handleRatioSelection(item.language, ratio.id)}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{ratio.name}</h4>
                        {isRatioSelected(item.language, ratio.id) && (
                          <Check className="h-5 w-5 text-amber-500" />
                        )}
                      </div>
                      
                      <div className="relative h-32 w-full mb-2 flex items-center justify-center bg-gray-50 rounded overflow-hidden">
                        <img 
                          src={ratio.image} 
                          alt={ratio.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      
                      <p className="text-sm text-gray-500">{ratio.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {getAvailableLanguages().length > 0 && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => setAddLanguageOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add Language
              </Button>
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-32"
            >
              {isSubmitting ? "Processing..." : "Request variations"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Language Sheet */}
      <Sheet open={addLanguageOpen} onOpenChange={setAddLanguageOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Add Language</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Select Language</label>
              <Select onValueChange={setSelectedNewLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a language" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableLanguages().map((lang) => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddLanguage}
              disabled={!selectedNewLanguage}
              className="w-full"
            >
              Add Language
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Custom Voice Over Selection Modal for Variations */}
      {voiceOverModalOpen && (
        <VoiceOverSelectionModal 
          open={voiceOverModalOpen}
          onOpenChange={setVoiceOverModalOpen}
          projectId={projectId}
          languages={currentLanguage || undefined}
          onVoiceSelected={handleVoiceOverSelected}
        />
      )}
    </>
  );
};

export default VariationsSelectionModal;

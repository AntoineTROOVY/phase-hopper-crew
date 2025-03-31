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

    const incomplete = languageSelections.some(item => !item.selectedRatio || (!item.voiceOver && isLanguageAddedByClient(item.language)));
    
    if (incomplete) {
      setError("Please select an aspect ratio and voice-over for each language.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        "ID-PROJET": projectId,
        "variations": languageSelections.map(item => ({
          language: item.language,
          aspectRatio: item.selectedRatio,
          voiceOver: item.voiceOver
        }))
      };

      console.log("Variations submission payload:", payload);
      
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

  const isLanguageAddedByClient = (language: string) => {
    if (!languages) return true;
    const originalLanguages = languages.split(',').map(lang => lang.trim());
    return !originalLanguages.includes(language);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Select Variations</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Choose your format variations for each language
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            {languageSelections.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">{item.language}</h3>
                  {isLanguageAddedByClient(item.language) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveLanguage(item.language)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {isLanguageAddedByClient(item.language) && (
                  <div className="mb-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">Voice-Over</p>
                      <Button 
                        variant={item.voiceOver ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => handleOpenVoiceOverModal(item.language)}
                      >
                        {item.voiceOver ? item.voiceOver : "Select Voice"}
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="mb-2">
                  <p className="text-sm text-gray-500 mb-2">Format</p>
                  <div className="grid grid-cols-5 gap-2">
                    {aspectRatioOptions.map((ratio) => (
                      <div 
                        key={ratio.id}
                        className={`flex flex-col items-center justify-center p-2 border rounded cursor-pointer transition-all ${
                          isRatioSelected(item.language, ratio.id) 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'hover:border-gray-300'
                        }`}
                        onClick={() => handleRatioSelection(item.language, ratio.id)}
                        title={ratio.description}
                      >
                        <div className="relative w-full aspect-square mb-1 flex items-center justify-center">
                          {isRatioSelected(item.language, ratio.id) && (
                            <div className="absolute top-0 right-0 -mt-1 -mr-1 bg-blue-500 rounded-full p-0.5">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <img 
                            src={ratio.image} 
                            alt={ratio.name} 
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>
                        <span className="text-xs text-center truncate w-full">
                          {ratio.name.replace(' (', '\n(')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            {getAvailableLanguages().length > 0 ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={() => setAddLanguageOpen(true)}
                size="sm"
              >
                <Plus className="h-3 w-3" />
                Add Language
              </Button>
            ) : (
              <div></div>
            )}
            
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Request variations"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={addLanguageOpen} onOpenChange={setAddLanguageOpen}>
        <SheetContent className="sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>Add Language</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <div className="mb-4">
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

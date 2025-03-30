
import React, { useState, useEffect } from 'react';
import { Package, Check, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

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
    image: 'public/lovable-uploads/551f47cd-0d38-4fa1-8966-7ab196f8fcbb.png'
  },
  { 
    id: 'portrait_2_3', 
    name: 'Portrait (2:3)', 
    ratio: 2/3, 
    description: 'Optimized for Pinterest pins and some mobile formats',
    image: 'public/lovable-uploads/fb9309c2-e856-4d7d-a56b-aebe9ca4ce2a.png'
  },
  { 
    id: 'portrait_4_5', 
    name: 'Portrait (4:5)', 
    ratio: 4/5, 
    description: 'Great for Instagram and Facebook photos',
    image: 'public/lovable-uploads/e7cda177-68ca-4aec-a3e4-ea817eda5a12.png'
  },
  { 
    id: 'portrait_9_16', 
    name: 'Portrait (9:16)', 
    ratio: 9/16, 
    description: 'Ideal for Stories, Reels, and TikTok',
    image: 'public/lovable-uploads/da9d3614-e386-49b2-b639-b5aab97c4eeb.png'
  },
  { 
    id: 'landscape_16_9', 
    name: 'Landscape (16:9)', 
    ratio: 16/9, 
    description: 'Standard for YouTube, presentations, and websites',
    image: 'public/lovable-uploads/337c0929-f433-496e-8822-804a09e659bc.png'
  }
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
  const { toast } = useToast();

  useEffect(() => {
    if (languages) {
      const languageArray = languages.split(',').map(lang => lang.trim());
      setLanguageSelections(
        languageArray.map(language => ({
          language,
          selectedRatio: null
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

  const handleSubmit = async () => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "Project ID is missing. Cannot submit selection.",
        variant: "destructive"
      });
      return;
    }

    // Check if all languages have a selection
    const incomplete = languageSelections.some(item => !item.selectedRatio);
    
    if (incomplete) {
      setError("Please select an aspect ratio for each language.");
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
          aspectRatio: item.selectedRatio
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Select Variations</DialogTitle>
        </DialogHeader>
        
        <div className="bg-blue-50 p-4 rounded-md mb-4">
          <h3 className="font-medium mb-2">Select one aspect ratio variation for each language:</h3>
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
              <h3 className="font-medium text-lg mb-4">{item.language}</h3>
              
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
  );
};

export default VariationsSelectionModal;

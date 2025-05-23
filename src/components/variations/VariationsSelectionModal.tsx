import React, { useState, useEffect } from 'react';
import { Package, Check, AlertCircle, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import VoiceOverSelectionModal from '@/components/voice/VoiceOverSelectionModal';
import Airtable from 'airtable';
import { fetchAirtableRecordIdByProjectId } from '@/services/projectService';
import { useBranding } from '@/contexts/BrandingContext';

interface AspectRatioOption {
  id: string;
  name: string;
  ratio: number;
  description: string;
  image: string;
}

interface LanguageSelection {
  language: string;
  selectedRatio: string[];
  voiceOver: string | null;
  isOriginalLanguage: boolean;
  voiceOverId?: string;
}

interface VariationsSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  languages?: string;
  onSelectionComplete?: () => void;
  duration: number; // en secondes
  hasVoiceOver?: boolean; // Indique si le projet a besoin de voix-off
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

const formatMap: Record<string, string> = {
  '16:9': 'landscape_16_9',
  '1:1': 'square',
  '4:5': 'portrait_4_5',
  '2:3': 'portrait_2_3',
  '9:16': 'portrait_9_16'
};

// Configuration Airtable (comme dans projectService)
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pata4KxDhV4JwzJmZ.12a6dbcc38032d0da0514e2fec16fa9e03653292b920775c4d2db56570821d3b';
const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
const AIRTABLE_VARIATIONS_TABLE = 'VARIATIONS';
const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

const VariationsSelectionModal = ({ 
  open, 
  onOpenChange, 
  projectId, 
  languages,
  onSelectionComplete,
  duration,
  hasVoiceOver = true // Par défaut, on suppose que le projet a des voix-off
}: VariationsSelectionModalProps) => {
  const [languageSelections, setLanguageSelections] = useState<LanguageSelection[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addLanguageOpen, setAddLanguageOpen] = useState(false);
  const [selectedNewLanguage, setSelectedNewLanguage] = useState<string | null>(null);
  const [voiceOverModalOpen, setVoiceOverModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  const [initialFormat, setInitialFormat] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Récupération des taux de l'agence
  const { rateAdditionalLanguage, rateAdditionalFormat } = useBranding();

  useEffect(() => {
    if (languages) {
      const languageArray = languages.split(',').map(lang => lang.trim());
      setLanguageSelections(
        languageArray.map(language => ({
          language,
          selectedRatio: [],
          voiceOver: null,
          isOriginalLanguage: true,
          voiceOverId: undefined
        }))
      );
    }
  }, [languages]);

  const handleToggleRatio = (language: string, ratioId: string) => {
    setLanguageSelections(prev =>
      prev.map(item => {
        if (item.language !== language) return item;
        const selected = item.selectedRatio || [];
        if (selected.includes(ratioId)) {
          return { ...item, selectedRatio: selected.filter(r => r !== ratioId) };
        } else {
          return { ...item, selectedRatio: [...selected, ratioId] };
        }
      })
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
        selectedRatio: [],
        voiceOver: null,
        isOriginalLanguage: false,
        voiceOverId: undefined
      }
    ]);
    
    setAddLanguageOpen(false);
    setSelectedNewLanguage(null);
  };

  const handleOpenVoiceOverModal = (language: string) => {
    setCurrentLanguage(language);
    setVoiceOverModalOpen(true);
  };

  const handleVoiceOverSelected = (voiceId: string, voiceName?: string) => {
    if (!currentLanguage) return;

    setLanguageSelections(prev => 
      prev.map(item => 
        item.language === currentLanguage 
          ? { ...item, voiceOver: voiceName || '', voiceOverId: voiceId } 
          : item
      )
    );
    setVoiceOverModalOpen(false);
  };

  const handleRemoveLanguage = (language: string) => {
    const selection = languageSelections.find(item => item.language === language);
    
    if (selection?.isOriginalLanguage) {
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

    // On récupère le vrai record ID du projet dans Airtable
    let airtableProjectRecordId: string | null = null;
    try {
      airtableProjectRecordId = await fetchAirtableRecordIdByProjectId(projectId);
      if (!airtableProjectRecordId) {
        setError("Impossible de trouver le projet dans Airtable. Veuillez réessayer.");
        return;
      }
    } catch (err) {
      setError("Erreur lors de la récupération du projet dans Airtable.");
      return;
    }

    // Vérifier si toutes les langues ont au moins un ratio sélectionné
    // et une voix sélectionnée SEULEMENT si hasVoiceOver est true
    const incomplete = languageSelections.some(
      item => item.selectedRatio.length === 0 || 
      (hasVoiceOver && !item.voiceOver && !item.isOriginalLanguage)
    );
    
    if (incomplete) {
      setError(hasVoiceOver 
        ? "Please select at least one aspect ratio and voice-over for each language." 
        : "Please select at least one aspect ratio for each language."
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // On prépare les records à créer dans la table VARIATIONS - un record par langue
      const recordsToCreate = languageSelections.map(item => ({
        fields: {
          // Tous les formats sélectionnés pour cette langue dans un seul tableau
          "Format": item.selectedRatio.map(ratioId => getFormatFromRatioId(ratioId)),
          "Language": item.language,
          "Project": [airtableProjectRecordId],
          "Price": getPriceForLanguage(item, duration), // Prix interne calculé avec des taux fixes (3€ et 1€)
          "Displayed cost": getDisplayedCostForLanguage(item, duration), // Prix affiché calculé avec les taux de l'agence
          "Voicer": hasVoiceOver && item.voiceOverId ? [item.voiceOverId] : [],
          "Payment Statut": "Non Paid"
        }
      }));

      // Fonction utilitaire pour convertir l'id du ratio en format texte
      function getFormatFromRatioId(ratioId: string): string {
        switch (ratioId) {
          case 'landscape_16_9': return '16:9';
          case 'square': return '1:1';
          case 'portrait_4_5': return '4:5';
          case 'portrait_2_3': return '2:3';
          case 'portrait_9_16': return '9:16';
          default: return '';
        }
      }

      // On crée les records dans Airtable (par paquets de 10 max)
      const chunkSize = 10;
      for (let i = 0; i < recordsToCreate.length; i += chunkSize) {
        const chunk = recordsToCreate.slice(i, i + chunkSize);
        await new Promise((resolve, reject) => {
          base(AIRTABLE_VARIATIONS_TABLE).create(chunk, function(err, records) {
            if (err) {
              console.error('Error creating variations:', err);
              reject(err);
            } else {
              resolve(records);
            }
          });
        });
      }

      // Mettre à jour le statut du projet à 'In progress' dans Airtable
      await new Promise((resolve, reject) => {
        base('PIPELINE PROJECT').update(airtableProjectRecordId!, { Status: 'In progress' }, function(err, record) {
          if (err) {
            reject(err);
          } else {
            resolve(record);
          }
        });
      });

      toast({
        title: "Variations requested",
        description: "Your aspect ratio variations have been requested successfully.",
        variant: "default"
      });

      onOpenChange(false);
      if (onSelectionComplete) {
        onSelectionComplete();
      }
      // Rafraîchir la page pour mettre à jour l'affichage
      window.location.reload();
    } catch (error) {
      console.error('Error submitting variation selection:', error);
      setError("Failed to submit your variation selections. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to get filtered aspect ratio options for a language
  const getFilteredRatioOptionsForLanguage = (language: string) => {
    const selection = languageSelections.find(item => item.language === language);
    
    // If it's an original language and we have an initial format, filter out that format
    if (selection?.isOriginalLanguage && initialFormat) {
      return aspectRatioOptions.filter(option => option.id !== formatMap[initialFormat]);
    }
    
    // For new languages, show all formats
    return aspectRatioOptions;
  };

  const isRatioSelected = (language: string, ratioId: string) => {
    const selection = languageSelections.find(item => item.language === language);
    return selection?.selectedRatio.includes(ratioId);
  };

  const getSelectedLanguages = () => {
    return languageSelections.map(item => item.language);
  };

  const getAvailableLanguages = () => {
    const selectedLanguages = getSelectedLanguages();
    return availableLanguages.filter(lang => !selectedLanguages.includes(lang));
  };

  // Fonction utilitaire pour calculer le prix interne (avec taux fixes)
  function getPriceForLanguage(item: LanguageSelection, duration: number) {
    const nbFormats = item.selectedRatio.length;
    const isNew = !item.isOriginalLanguage;
    if (duration > 0 && nbFormats > 0) {
      if (isNew) {
        // Taux fixes : 3€/s pour nouvelle langue + 1€/s par format supplémentaire
        return 3 * duration + (nbFormats - 1) * 1 * duration;
      } else {
        // Taux fixes : 1€/s par format supplémentaire pour langue originale
        return (nbFormats - 1) * 1 * duration;
      }
    }
    return 0;
  }

  // Fonction utilitaire pour calculer le prix affiché à l'utilisateur (avec taux de l'agence)
  function getDisplayedCostForLanguage(item: LanguageSelection, duration: number) {
    const nbFormats = item.selectedRatio.length;
    const isNew = !item.isOriginalLanguage;
    if (duration > 0 && nbFormats > 0) {
      if (isNew) {
        // Taux de l'agence : rateAdditionalLanguage/s pour nouvelle langue + rateAdditionalFormat/s par format supplémentaire
        return rateAdditionalLanguage * duration + (nbFormats - 1) * rateAdditionalFormat * duration;
      } else {
        // Taux de l'agence : rateAdditionalFormat/s par format supplémentaire pour langue originale
        return (nbFormats - 1) * rateAdditionalFormat * duration;
      }
    }
    return 0;
  }

  // Fonction pour générer les détails du prix à afficher à l'utilisateur
  function getPriceDetails(item: LanguageSelection, duration: number) {
    const nbFormats = item.selectedRatio.length;
    const isNew = !item.isOriginalLanguage;
    let detail = '';
    
    if (duration > 0 && nbFormats > 0) {
      if (isNew) {
        const newLanguagePrice = rateAdditionalLanguage * duration;
        const additionalFormatsPrice = (nbFormats - 1) * rateAdditionalFormat * duration;
        
        if (nbFormats > 1) {
          detail = `${newLanguagePrice.toLocaleString('fr-FR')} € (${rateAdditionalLanguage} € × ${duration}s) + ${additionalFormatsPrice.toLocaleString('fr-FR')} € (${rateAdditionalFormat} € × ${duration}s × ${nbFormats - 1} formats supplémentaires)`;
        } else {
          detail = `${newLanguagePrice.toLocaleString('fr-FR')} € (${rateAdditionalLanguage} € × ${duration}s)`;
        }
      } else {
        const price = (nbFormats - 1) * rateAdditionalFormat * duration;
        if (nbFormats > 1) {
          detail = `${price.toLocaleString('fr-FR')} € (${rateAdditionalFormat} € × ${duration}s × ${nbFormats - 1} formats supplémentaires)`;
        } else {
          detail = 'Inclus';
        }
      }
    } else {
      detail = 'Inclus';
    }
    
    return detail;
  }

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
            {languageSelections.map((item, index) => {
              // Utiliser notre nouvelle fonction pour obtenir les détails du prix
              const detail = getPriceDetails(item, duration);
              
              return (
                <div key={index} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">{item.language}</h3>
                    {!item.isOriginalLanguage && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveLanguage(item.language)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {!item.isOriginalLanguage && hasVoiceOver && (
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
                      {getFilteredRatioOptionsForLanguage(item.language).map((ratio) => (
                        <div 
                          key={ratio.id}
                          className={`flex flex-col items-center justify-center p-2 border rounded cursor-pointer transition-all ${
                            item.selectedRatio.includes(ratio.id)
                              ? 'border-blue-500 bg-blue-50' 
                              : 'hover:border-gray-300'
                          }`}
                          onClick={() => handleToggleRatio(item.language, ratio.id)}
                          title={ratio.description}
                        >
                          <div className="relative w-full aspect-square mb-1 flex items-center justify-center">
                            {item.selectedRatio.includes(ratio.id) && (
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
                    {/* Affichage du prix détaillé (utilisant les taux de l'agence) */}
                    <div className="mt-2 text-sm text-orange-700 font-semibold">
                      {detail}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            {/* Affichage du vrai total à payer (toutes langues, tous suppléments) avec les taux de l'agence */}
            {duration > 0 && languageSelections.some(l => l.selectedRatio.length > 0) && (
              <div className="mb-2 text-base text-orange-700 font-semibold bg-orange-50 rounded p-2 w-full text-center">
                Total à payer : <b>{languageSelections.reduce((acc, l) => acc + getDisplayedCostForLanguage(l, duration), 0).toLocaleString('fr-FR')} €</b>
              </div>
            )}
            <div className="w-full flex sm:w-auto sm:flex-row flex-col gap-2 sm:gap-0 items-center justify-between">
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
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={addLanguageOpen} onOpenChange={setAddLanguageOpen}>
        <SheetContent className="sm:max-w-xs">
          <SheetHeader>
            <SheetTitle>Add Language</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <div className="mb-4 text-sm text-gray-700 bg-orange-50 rounded p-2">
              {duration > 0 ? (
                selectedNewLanguage ? (
                  <>Ajouter cette langue vous coûtera <b>{(duration * rateAdditionalLanguage).toLocaleString('fr-FR')} €</b> ({rateAdditionalLanguage} € × {duration} secondes).</>
                ) : (
                  <>Sélectionnez une langue pour voir le prix ({rateAdditionalLanguage} € × {duration} secondes).</>
                )
              ) : (
                <>La durée de la vidéo n'est pas renseignée, le prix ne peut pas être calculé.</>
              )}
            </div>
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
          onVoiceSelected={(voiceId, voiceName) => handleVoiceOverSelected(voiceId, voiceName)}
          languages={currentLanguage || undefined}
        />
      )}
    </>
  );
};

export default VariationsSelectionModal;

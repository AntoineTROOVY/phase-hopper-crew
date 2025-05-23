import React, { useState, useEffect } from 'react';
import { Filter, Check, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AudioPlayer from './AudioPlayer';
import { fetchVoiceOversFromAirtable, AirtableVoiceOver, fetchAirtableRecordIdByProjectId, updateProjectVoiceOvers } from '@/services/projectService';

interface VoiceOver {
  Name: string;
  Gender: string;
  Language: string;
  "Profil pic": string;
  Preview: string;
}

interface VoiceOverSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId?: string;
  languages?: string;
  onSelectionComplete?: () => void;
  onVoiceSelected?: (voiceId: string, voiceName: string) => void;
}

const VoiceOverSelectionModal = ({ 
  open, 
  onOpenChange, 
  projectId, 
  languages,
  onSelectionComplete,
  onVoiceSelected
}: VoiceOverSelectionModalProps) => {
  const [voiceOvers, setVoiceOvers] = useState<AirtableVoiceOver[]>([]);
  const [filteredVoiceOvers, setFilteredVoiceOvers] = useState<AirtableVoiceOver[]>([]);
  const [languageFilter, setLanguageFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVoiceOvers, setSelectedVoiceOvers] = useState<string[]>([]);
  const [projectLanguages, setProjectLanguages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (languages) {
      const languageArray = languages.split(',').map(lang => lang.trim());
      setProjectLanguages(languageArray);
      
      // On définit la langue comme filtre par défaut, que ce soit en mode sélection de voix 
      // ou en mode normal avec une seule langue
      if (languageArray.length === 1) {
        setLanguageFilter(languageArray[0]);
      }
    }
  }, [languages]);

  useEffect(() => {
    const fetchVoiceOvers = async () => {
      setLoading(true);
      try {
        const data = await fetchVoiceOversFromAirtable();
        setVoiceOvers(data || []);
        
        // Extraire toutes les langues disponibles des voix
        const uniqueLanguages = Array.from(new Set(data.map(vo => vo.Language))).filter(Boolean);
        setAvailableLanguages(uniqueLanguages);
        
        // Filtrer automatiquement si une langue est spécifiée
        let languageToFilter = null;
        
        // Si on a une langue unique ou en mode sélection de voix
        if (languages) {
          const languageArray = languages.split(',').map(lang => lang.trim());
          if (languageArray.length === 1) {
            languageToFilter = languageArray[0];
          }
        }
        
        if (languageToFilter) {
          setLanguageFilter(languageToFilter);
          setFilteredVoiceOvers(data.filter(vo => vo.Language === languageToFilter) || []);
        } else {
        setFilteredVoiceOvers(data || []);
        }
      } catch (error) {
        console.error('Error fetching voice-overs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (open) {
      fetchVoiceOvers();
    }
  }, [open, languages]);

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

  const toggleVoiceOverSelection = (voiceOverId: string) => {
    if (onVoiceSelected) {
      const selected = voiceOvers.find(vo => vo.id === voiceOverId);
      setSelectedVoiceOvers([voiceOverId]);
      if (selected) {
        onVoiceSelected(voiceOverId, selected.Name);
      } else {
        onVoiceSelected(voiceOverId, '');
      }
      return;
    }

    setSelectedVoiceOvers(prev => {
      if (prev.includes(voiceOverId)) {
        return prev.filter(id => id !== voiceOverId);
      } else {
        if (prev.length < projectLanguages.length) {
          return [...prev, voiceOverId];
        }
        return prev;
      }
    });
  };

  const handleConfirmSelection = async () => {
    if (!projectId) {
      toast({
        title: "Erreur",
        description: "Project ID is missing. Cannot submit selection.",
        variant: "destructive"
      });
      return;
    }
    if (selectedVoiceOvers.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner au moins une voix-off.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // On récupère le vrai record ID du projet dans Airtable
      const airtableProjectRecordId = await fetchAirtableRecordIdByProjectId(projectId);
      if (!airtableProjectRecordId) {
        setError("Impossible de trouver le projet dans Airtable. Veuillez réessayer.");
        setIsSubmitting(false);
        return;
      }
      // On met à jour le champ Voix-off avec les record IDs sélectionnés
      await updateProjectVoiceOvers(airtableProjectRecordId, selectedVoiceOvers);
      toast({
        title: "Sélection enregistrée",
        description: "Votre sélection de voix-off a bien été enregistrée dans Airtable.",
        variant: "default"
      });
      onOpenChange(false);
      if (onSelectionComplete) {
        onSelectionComplete();
      }
    } catch (error) {
      console.error('Error updating voice-over selection:', error);
      setError("Échec de l'enregistrement de votre sélection. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Select a Voice-Over</DialogTitle>
        </DialogHeader>
        
        {projectLanguages.length > 0 && !onVoiceSelected && (
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">You selected the following languages for your video:</h3>
            <ul className="list-disc pl-5 mb-2">
              {projectLanguages.map((language, index) => (
                <li key={index}>{language}</li>
              ))}
            </ul>
            <p className="font-medium text-blue-700">
              You need to select {projectLanguages.length} voice-over{projectLanguages.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Selected: {selectedVoiceOvers.length} of {projectLanguages.length}
            </p>
          </div>
        )}
        
        {onVoiceSelected && (
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">Select a voice-over for this language:</h3>
            <p className="font-medium text-blue-700">
              {languages}
            </p>
          </div>
        )}
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex items-center mb-2">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <h3 className="text-sm font-medium">Filters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Language</label>
              <Select 
                onValueChange={handleLanguageChange} 
                defaultValue={languageFilter || "all"}
                value={languageFilter || "all"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {availableLanguages.map((language) => (
                    <SelectItem key={language} value={language}>{language}</SelectItem>
                  ))}
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
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={voiceOver.ProfilPic && voiceOver.ProfilPic[0]?.url} alt={voiceOver.Name} />
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
                  </div>
                  <Button
                    variant={selectedVoiceOvers.includes(voiceOver.id) ? "default" : "outline"}
                    onClick={() => toggleVoiceOverSelection(voiceOver.id)}
                    disabled={selectedVoiceOvers.length >= projectLanguages.length && !selectedVoiceOvers.includes(voiceOver.id)}
                    className="min-w-24"
                  >
                    {selectedVoiceOvers.includes(voiceOver.id) ? (
                      <>
                        <Check className="mr-1 h-4 w-4" /> 
                        Selected
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </div>
                
                {voiceOver.Preview && voiceOver.Preview.length > 0 && voiceOver.Preview[0].url && (
                  <AudioPlayer 
                    url={voiceOver.Preview[0].url} 
                    filename={`${voiceOver.Name} (Preview)`} 
                  />
                )}
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={handleConfirmSelection}
            disabled={
              selectedVoiceOvers.length === 0 || 
              isSubmitting ||
              (!onVoiceSelected && selectedVoiceOvers.length !== projectLanguages.length)
            }
            className="min-w-32"
          >
            {isSubmitting ? "Processing..." : onVoiceSelected ? "Select Voice" : "Confirm selection"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceOverSelectionModal;

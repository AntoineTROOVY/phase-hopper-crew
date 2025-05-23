import React, { useState } from 'react';
import SelectVoiceOver from './SelectVoiceOver';

interface Variation {
  id: string;
  language: string;
  voiceOver?: { id: string; name: string };
}

const RequestVariation: React.FC = () => {
  const [variations, setVariations] = useState<Variation[]>([
    { id: '1', language: 'Anglais' },
    { id: '2', language: 'Français' },
  ]);
  const [isVoiceOverPopupOpen, setIsVoiceOverPopupOpen] = useState(false);
  const [currentVariationId, setCurrentVariationId] = useState<string | null>(null);

  const handleVoiceSelect = (voice: { id: string; name: string }) => {
    if (currentVariationId) {
      setVariations(prev =>
        prev.map(variation =>
          variation.id === currentVariationId ? { ...variation, voiceOver: voice } : variation
        )
      );
    }
    setIsVoiceOverPopupOpen(false);
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Demander une variation</h2>
      {variations.map(variation => (
        <div key={variation.id} style={{ marginBottom: '16px', padding: '8px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <p>{variation.language}</p>
          {variation.voiceOver ? (
            <p>VoiceOver : {variation.voiceOver.name}</p>
          ) : (
            <button
              onClick={() => {
                setCurrentVariationId(variation.id);
                setIsVoiceOverPopupOpen(true);
              }}
              style={{ padding: '8px 16px', backgroundColor: '#f59e42', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Sélectionner la voix off
            </button>
          )}
        </div>
      ))}
      {isVoiceOverPopupOpen && (
        <SelectVoiceOver
          onSelect={handleVoiceSelect}
          onClose={() => setIsVoiceOverPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default RequestVariation; 
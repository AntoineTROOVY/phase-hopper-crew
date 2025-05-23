import React, { useState } from 'react';

interface Voice {
  id: string;
  name: string;
}

interface SelectVoiceOverProps {
  onSelect: (voice: Voice) => void;
  onClose: () => void;
}

const SelectVoiceOver: React.FC<SelectVoiceOverProps> = ({ onSelect, onClose }) => {
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);

  // Exemple de voix off disponibles (à remplacer par tes vraies données)
  const voices: Voice[] = [
    { id: '1', name: 'Voice 1' },
    { id: '2', name: 'Voice 2' },
    { id: '3', name: 'Voice 3' },
  ];

  const handleSelect = () => {
    if (selectedVoice) {
      onSelect(selectedVoice);
      onClose();
    }
  };

  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', background: '#fff' }}>
      <h3>Sélectionner une voix off</h3>
      {voices.map(voice => (
        <div
          key={voice.id}
          onClick={() => setSelectedVoice(voice)}
          style={{
            padding: '8px',
            margin: '4px',
            backgroundColor: selectedVoice?.id === voice.id ? '#f59e42' : '#f0f0f0',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          {voice.name}
        </div>
      ))}
      <button
        onClick={handleSelect}
        style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#f59e42', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        disabled={!selectedVoice}
      >
        Sélectionner
      </button>
      <button
        onClick={onClose}
        style={{ marginLeft: '8px', padding: '8px 16px', backgroundColor: '#eee', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Annuler
      </button>
    </div>
  );
};

export default SelectVoiceOver; 
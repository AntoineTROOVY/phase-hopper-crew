import React, { useState } from 'react';
import { FileText, Mic, Image, Film, Package } from 'lucide-react';
import CollapsiblePreview from '@/components/CollapsiblePreview';
import ScriptPreview from '@/components/ScriptPreview';
import VoiceOverPreview from '@/components/VoiceOverPreview';
import VariationsSelectionModal from '@/components/variations/VariationsSelectionModal';
import { PipelineProject } from '@/services/projectService';
import Airtable from 'airtable';

interface ProjectContentSectionsProps {
  project: PipelineProject;
}

interface SectionInfo {
  type: string;
  status: string;
  priority: number;
  render: () => React.ReactNode;
}

const ProjectContentSections = ({
  project
}: ProjectContentSectionsProps) => {
  const [variationsModalOpen, setVariationsModalOpen] = useState(false);

  // Helper to determine if voice over section should be shown
  const status = project["Status"]?.toLowerCase() || '';
  const phase = project["Phase"]?.toLowerCase() || '';
  const shouldShowVoiceOver =
    (project["Voice-file-url"] && project["Voice-file-url"].length > 0)
    || (Array.isArray(project["Voice-file"]) && project["Voice-file"].length > 0)
    || (phase.includes('voice') && (
      status.includes('not') && status.includes('start')
      || status.includes('in progress')
      || status.includes('review')
    ));

  // Helper to determine if variations section should be shown
  const shouldShowVariations = project["Variations-url"] && project["Variations-url"].length > 0 || project["Phase"]?.toLowerCase().includes('variations') && project["Status"]?.toLowerCase().includes('not') && project["Status"]?.toLowerCase().includes('start');

  // Helper for phase checks
  const isVoiceOverPhase = project["Phase"]?.includes("🎙️Voice-over") || false;
  const isVariationsPhase = project["Phase"]?.includes("📦 Variations") || false;
  
  // Nouvelle vérification pour masquer Storyboard et Animation dans le cas spécifique
  const isCopywritingInReview = project["Phase"] === "📝 Copywriting" && project["Status"] === "In review";

  // Determine if variations section is in "Not started" state
  const isVariationsNotStarted = isVariationsPhase && project["Status"]?.toLowerCase().includes('not') && project["Status"]?.toLowerCase().includes('start') && (!project["Variations-url"] || project["Variations-url"].length === 0);
  
  const handleVariationsRequest = () => {
    setVariationsModalOpen(true);
  };
  
  const handleVariationsComplete = () => {
    // This would typically refresh the data or update UI state
    console.log("Variations requested successfully");
  };

  // Fonction pour approuver le projet sans variations
  const handleApproveWithoutVariations = async () => {
    if (!project["ID-PROJET"]) return;
    // On récupère le vrai record ID du projet dans Airtable
    const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pata4KxDhV4JwzJmZ.12a6dbcc38032d0da0514e2fec16fa9e03653292b920775c4d2db56570821d3b';
    const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
    const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
    // Chercher le vrai recordId Airtable
    let recordId = null;
    try {
      // On suppose que l'ID-PROJET correspond au champ unique dans Airtable
      const records = await base('PIPELINE PROJECT').select({
        filterByFormula: `{ID-PROJET} = '${project["ID-PROJET"]}'`,
        maxRecords: 1
      }).firstPage();
      if (records && records.length > 0) {
        recordId = records[0].id;
      }
    } catch (e) {
      alert("Erreur lors de la récupération du projet dans Airtable");
      return;
    }
    if (!recordId) {
      alert("Projet introuvable dans Airtable");
      return;
    }
    // Mettre à jour le statut à 'Approved'
    await new Promise((resolve, reject) => {
      base('PIPELINE PROJECT').update(recordId, { Status: 'Approved' }, function(err, record) {
        if (err) {
          alert("Erreur lors de la mise à jour du statut");
          reject(err);
        } else {
          resolve(record);
        }
      });
    });
    window.location.reload();
  };
  
  // Function to determine section status (to Review, In Progress, Approved)
  const determineSectionStatus = (relevantPhase: string): string => {
    const currentPhase = project["Phase"] || '';
    const currentStatus = project["Status"] || '';
    const lowerCurrentPhase = currentPhase.toLowerCase();
    const lowerRelevantPhase = relevantPhase.toLowerCase();
    const lowerStatus = currentStatus.toLowerCase();
    
    // Special case for current phase & status
    if (lowerCurrentPhase.includes(lowerRelevantPhase) && lowerStatus.includes('review')) {
      return 'To Review';
    }
    
    return '';
  };
  
  // Create sections with priority
  const sections: SectionInfo[] = [];
  
  // Script section
  if (project["Script"]) {
    const scriptStatus = determineSectionStatus('Copywriting');
    sections.push({
      type: 'script',
      status: scriptStatus,
      priority: scriptStatus === 'To Review' ? 1 : 4,
      render: () => (
        <CollapsiblePreview 
          title="Script Preview" 
          icon={<FileText className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Copywriting" 
          projectStatus={project["Status"]} 
          externalUrl={project["Script"]} 
          projectId={project["ID-PROJET"] || ''}
        >
          <ScriptPreview scriptUrl={project["Script"]} />
        </CollapsiblePreview>
      )
    });
  }
      
  // Voice-Over section
  if (shouldShowVoiceOver) {
    const voiceStatus = determineSectionStatus('Voice');
    sections.push({
      type: 'voice',
      status: voiceStatus,
      priority: voiceStatus === 'To Review' ? 1 : isVoiceOverPhase ? 2 : 5,
      render: () => (
        <CollapsiblePreview 
          title="Voice-Over Preview" 
          icon={<Mic className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Voice" 
          projectStatus={project["Status"]} 
          projectId={project["ID-PROJET"] || ''} 
          initialOpen={isVoiceOverPhase}
        >
          <VoiceOverPreview 
            voiceFileUrl={project["Voice-file-url"] || ''} 
            voiceFile={project["Voice-file"] || null}
            phase={project["Phase"] || ''} 
            status={project["Status"] || ''} 
            projectId={project["ID-PROJET"] || ''} 
            languages={project["Langues"] || ''} 
          />
        </CollapsiblePreview>
      )
    });
  }
      
  // Storyboard section
  if (project["Storyboard"] && !isCopywritingInReview) {
    const storyboardStatus = determineSectionStatus('Storyboard');
    sections.push({
      type: 'storyboard',
      status: storyboardStatus,
      priority: storyboardStatus === 'To Review' ? 1 : 6,
      render: () => (
        <CollapsiblePreview 
          title="Storyboard" 
          icon={<Image className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Storyboard" 
          projectStatus={project["Status"]} 
          externalUrl={project["Storyboard"]} 
          projectId={project["ID-PROJET"] || ''}
        >
          {/* Content for Storyboard preview */}
          <div className="text-center py-4">
            <div className="text-gray-500">
              
            </div>
          </div>
        </CollapsiblePreview>
      )
    });
  }
      
  // Animation section
  if (project["Animation"] && !isCopywritingInReview) {
    const animationStatus = determineSectionStatus('Animation');
    sections.push({
      type: 'animation',
      status: animationStatus,
      priority: animationStatus === 'To Review' ? 1 : 7,
      render: () => (
        <CollapsiblePreview 
          title="Animation" 
          icon={<Film className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Animation" 
          projectStatus={project["Status"]} 
          externalUrl={project["Animation"]} 
          projectId={project["ID-PROJET"] || ''}
        >
          {/* Content for Animation preview */}
          <div className="text-center py-4">
            <div className="text-gray-500">
              
            </div>
          </div>
        </CollapsiblePreview>
      )
    });
  }
      
  // Variations section
  if (shouldShowVariations) {
    const variationsStatus = determineSectionStatus('Variations');
    sections.push({
      type: 'variations',
      status: variationsStatus,
      priority: variationsStatus === 'To Review' ? 1 : isVariationsPhase ? 3 : 8,
      render: () => (
        <CollapsiblePreview 
          title="Variations" 
          icon={<Package className="h-5 w-5" />} 
          currentPhase={project["Phase"] || ''} 
          relevantPhase="Variations" 
          projectStatus={project["Status"]} 
          externalUrl={project["Variations-url"] || ''} 
          projectId={project["ID-PROJET"] || ''} 
          initialOpen={isVariationsPhase} 
          highlightAction={isVariationsNotStarted}
        >
          {(isVariationsPhase && project["Variations-url"] && project["Variations-url"].length > 0 && project["Status"]?.toLowerCase().includes('review')) ? (
            <div className="text-center py-4">
              <div className="text-gray-500 mb-4">
                Merci de vérifier la variation générée avant d'approuver.
              </div>
              <div className="flex justify-center gap-4">
                <a
                  href={project["Variations-url"]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Review
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              {isVariationsNotStarted ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-amber-600 mb-4">
                    No variations have been requested yet. Please request variations to proceed.
                  </p>
                  <div className="flex gap-2">
                    <button 
                      className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-md flex items-center gap-2" 
                      onClick={handleVariationsRequest}
                    >
                      <Package className="h-4 w-4" />
                      Ask for variations
                    </button>
                    <button
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100"
                      onClick={handleApproveWithoutVariations}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">
                  
                </div>
              )}
            </div>
          )}
        </CollapsiblePreview>
      )
    });
  }
  
  // Sort sections by priority
  sections.sort((a, b) => a.priority - b.priority);
  
  return (
    <>
      {sections.map((section, index) => (
        <React.Fragment key={section.type}>
          {section.render()}
        </React.Fragment>
      ))}
      
      {/* Section spéciale Testimonial : visible uniquement quand la phase est exactement "⚡Testimonial" ET statut différent de Approved */}
      {project["Phase"] === "⚡Testimonial" && project["recordId"] && project["Status"]?.toLowerCase() !== 'approved' && (
        <div className="mt-8 p-6 border-2 border-amber-500 bg-amber-50 rounded-lg text-center flex flex-col items-center">
          <h3 className="text-xl font-semibold mb-2 text-amber-700">Finalisez votre projet</h3>
          <p className="mb-4 text-amber-800">Pour compléter votre projet, merci de laisser un témoignage. Le projet ne sera considéré comme terminé qu'après cette étape.</p>
          <a
            href={`https://www.videoask.com/flf68l04u?record-id=${project["recordId"]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-md text-lg font-bold shadow-md transition"
          >
            Laisser un témoignage
          </a>
        </div>
      )}
      
      <VariationsSelectionModal 
        open={variationsModalOpen} 
        onOpenChange={setVariationsModalOpen} 
        projectId={project["ID-PROJET"]} 
        languages={project["Langues"]} 
        onSelectionComplete={handleVariationsComplete} 
        duration={project["Duration"] ? Number(project["Duration"]) : 0}
        hasVoiceOver={project["Voice-Over"] || false}
      />
    </>
  );
};

export default ProjectContentSections;

import React from 'react';
import { FileText, Mic, Image, Film, Package } from 'lucide-react';

const phaseOrder = [
  { name: '📝 Copywriting', icon: <FileText className="h-5 w-5 inline-block mr-1" /> },
  { name: '🎙️Voice-over', icon: <Mic className="h-5 w-5 inline-block mr-1" /> },
  { name: '🖼️ Storyboard', icon: <Image className="h-5 w-5 inline-block mr-1" /> },
  { name: '🎞️ Animation', icon: <Film className="h-5 w-5 inline-block mr-1" /> },
  { name: '📦 Variations', icon: <Package className="h-5 w-5 inline-block mr-1" /> },
];

function getPhaseIndex(phase) {
  return phaseOrder.findIndex(p => p.name === phase);
}

const TasksWidget = ({ projects }) => {
  // Filtrer les projets en cours (hors testimonial terminé)
  const inProgressProjects = projects.filter(
    p => !(p.Phase === '⚡Testimonial' && p.Status?.toLowerCase() === 'approved')
  );

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-md mx-auto border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">Tâches en cours</span>
        <span className="text-lg">▾</span>
      </div>
      <hr className="mb-3" />
      {inProgressProjects.map((project, idx) => {
        const phaseIdx = getPhaseIndex(project.Phase);
        const totalPhases = phaseOrder.length;
        return (
          <div key={project.recordId} className="mb-5 last:mb-0">
            <div className="flex items-center font-semibold text-gray-700 mb-0.5">
              {phaseOrder[phaseIdx]?.icon}
              <span>{phaseOrder[phaseIdx]?.name.replace(/^[^a-zA-Z0-9]+/, '') || project.Phase}</span>
            </div>
            <div className="text-sm text-gray-500 mb-1 truncate">{project["ID-PROJET"] || project["Company"] || 'Projet'}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((phaseIdx + 1) / totalPhases) * 100}%` }}
                ></div>
              </div>
              <span className="text-blue-600 text-sm font-semibold ml-2">{phaseIdx + 1}/{totalPhases}</span>
            </div>
          </div>
        );
      })}
      <hr className="my-3" />
      <div className="text-blue-600 text-sm font-semibold text-center">
        Nombre de tâches en cours : {inProgressProjects.length}
      </div>
    </div>
  );
};

export default TasksWidget; 
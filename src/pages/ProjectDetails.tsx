import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { fetchProjectById, PipelineProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectCalendar from '@/components/ProjectCalendar';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import ProjectInfo from '@/components/project-details/ProjectInfo';
import ProjectContentSections from '@/components/project-details/ProjectContentSections';
import LoadingState from '@/components/project-details/LoadingState';
import NotFoundState from '@/components/project-details/NotFoundState';
import { useUser } from '@/contexts/UserContext';
import Airtable from 'airtable';
import { FileText, Mic, Image, Film, Package } from 'lucide-react';

interface Phase {
  name: string;
  icon: React.ReactNode;
}

interface CurrentTaskWidgetProps {
  project: PipelineProject;
}

// Composant TaskWidget adapté pour un seul projet
const CurrentTaskWidget: React.FC<CurrentTaskWidgetProps> = ({ project }) => {
  if (!project) return null;
  
  const phaseOrder: Phase[] = [
    { name: '📝 Copywriting', icon: <FileText className="h-5 w-5 inline-block mr-1" /> },
    { name: '🎙️Voice-over', icon: <Mic className="h-5 w-5 inline-block mr-1" /> },
    { name: '🖼️ Storyboard', icon: <Image className="h-5 w-5 inline-block mr-1" /> },
    { name: '🎞️ Animation', icon: <Film className="h-5 w-5 inline-block mr-1" /> },
    { name: '📦 Variations', icon: <Package className="h-5 w-5 inline-block mr-1" /> },
  ];
  
  const getPhaseIndex = (phase: string | null | undefined): number => {
    if (!phase) return -1;
    return phaseOrder.findIndex(p => p.name === phase);
  };
  
  const phaseIdx = getPhaseIndex(project["Phase"]);
  const totalPhases = phaseOrder.length;
  
  // Si on ne peut pas déterminer la phase, on n'affiche pas le widget
  if (phaseIdx === -1) return null;
  
  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6 border">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">Tâche en cours</span>
      </div>
      <hr className="mb-3" />
      <div className="mb-3">
        <div className="flex items-center font-semibold text-gray-700 mb-0.5">
          {phaseOrder[phaseIdx]?.icon}
          <span>{phaseOrder[phaseIdx]?.name.replace(/^[^a-zA-Z0-9]+/, '') || project["Phase"]}</span>
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
      <div className="text-gray-500 text-sm">
        {project["Status"] || 'En cours'}
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<PipelineProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allowedProjectIds, setAllowedProjectIds] = useState<string[]>([]);
  const [checkedAccess, setCheckedAccess] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        setProject(null);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await fetchProjectById(projectId);
        setProject(data);
        if (!data) {
          toast({
            title: "Project not found",
            description: `No project found with ID: ${projectId}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        toast({
          title: "Error loading project",
          description: "There was a problem loading the project details. Please try again later.",
          variant: "destructive"
        });
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [projectId, toast]);

  useEffect(() => {
    const fetchAllowedProjects = async () => {
      if (!user?.email) return;
      const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pata4KxDhV4JwzJmZ.12a6dbcc38032d0da0514e2fec16fa9e03653292b920775c4d2db56570821d3b';
      const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
      const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);
      try {
        const records = await base('CRM').select({
          filterByFormula: `{Email} = '${user.email}'`,
          maxRecords: 1
        }).firstPage();
        if (records && records.length > 0) {
          const crm = records[0];
          const companies = crm.get('COMPANY');
          if (companies && Array.isArray(companies)) {
            let allProjectIds: string[] = [];
            for (const companyId of companies) {
              const companyRecords = await base('COMPANY').select({
                filterByFormula: `RECORD_ID() = '${companyId}'`,
                maxRecords: 1
              }).firstPage();
              if (companyRecords && companyRecords.length > 0) {
                const projectIds = companyRecords[0].get('PIPELINE PROJECT');
                if (projectIds && Array.isArray(projectIds)) {
                  allProjectIds = allProjectIds.concat(projectIds);
                }
              }
            }
            setAllowedProjectIds(allProjectIds);
          }
        }
      } catch (e) {
        setAllowedProjectIds([]);
      } finally {
        setCheckedAccess(true);
      }
    };
    fetchAllowedProjects();
  }, [user]);

  if (isLoading || !checkedAccess) {
    return <LoadingState />;
  }

  if (!project || (allowedProjectIds.length > 0 && !allowedProjectIds.includes(project.recordId))) {
    return <NotFoundState projectId={projectId} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <AppHeader 
        title="Project Details" 
        subtitle={`ID: ${project["ID-PROJET"]}`} 
        showBackButton={true}
      />
      
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid gap-6 md:grid-cols-3 mb-6">
          <div className="md:col-span-2">
            <Card>
          <CardContent className="pt-6">
                <CurrentTaskWidget project={project} />
            <ProjectTimeline 
              currentPhase={project["Phase"] || ''} 
              status={project["Status"] || ''} 
              hasVoiceOver={project["Voice-Over"] === true} 
            />
          </CardContent>
        </Card>
          </div>
          
          <div>
            <ProjectCalendar 
              startDate={project["Date de début"]} 
              endDate={project["Deadline"]} 
            />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <ProjectInfo project={project} />
            
            <ProjectContentSections project={project} />
          </div>
          
          <div className="space-y-6">
            {/* Contenu de la colonne de droite */}
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default ProjectDetails;

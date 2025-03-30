
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
import ProjectStatusCard from '@/components/project-details/ProjectStatusCard';
import LoadingState from '@/components/project-details/LoadingState';
import NotFoundState from '@/components/project-details/NotFoundState';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<PipelineProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadProject = async () => {
      if (!projectId) {
        navigate('/');
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
          navigate('/');
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        toast({
          title: "Error loading project",
          description: "There was a problem loading the project details. Please try again later.",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [projectId, toast, navigate]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
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
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ProjectTimeline currentPhase={project["Phase"] || ''} status={project["Status"] || ''} />
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <ProjectInfo project={project} />
            
            <ProjectContentSections project={project} />
          </div>
          
          <div className="space-y-6">
            <ProjectStatusCard project={project} />
            
            <ProjectCalendar 
              startDate={project["Date de début"]} 
              endDate={project["Deadline"]} 
            />
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default ProjectDetails;

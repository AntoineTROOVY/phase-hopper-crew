import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building, User, Clock, FileText, Image, Film, Headphones, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/StatusBadge';
import { fetchProjectById, PipelineProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import AnimationPreview from '@/components/AnimationPreview';
import StoryboardPreview from '@/components/StoryboardPreview';
import ScriptPreview from '@/components/ScriptPreview';
import VoiceOverPreview from '@/components/VoiceOverPreview';
import ProjectTimeline from '@/components/ProjectTimeline';
import ProjectCalendar from '@/components/ProjectCalendar';
import CollapsiblePreview from '@/components/CollapsiblePreview';
import VariationsPreview from '@/components/VariationsPreview';

const ProjectDetails = () => {
  const {
    projectId
  } = useParams<{
    projectId: string;
  }>();
  const [project, setProject] = useState<PipelineProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    toast
  } = useToast();
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading project details...</h2>
          <p className="text-gray-500">Please wait while we fetch your data.</p>
        </div>
      </div>;
  }

  if (!project) {
    return <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <p className="text-gray-500 mb-4">The project you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Go back to dashboard</Link>
          </Button>
        </div>
      </div>;
  }

  const logoUrl = project["Logo url"] || '';
  const shouldShowVoiceOver = project["Voice-file-url"] && project["Voice-file-url"].length > 0 || project["Phase"]?.toLowerCase().includes('voice') && (project["Status"]?.toLowerCase().includes('not') && project["Status"]?.toLowerCase().includes('start') || project["Status"]?.toLowerCase().includes('in progress'));
  
  const isVoiceOverPhase = project["Phase"]?.includes("🎙️Voice-over") || false;
  const isVariationsPhase = project["Phase"]?.includes("📦 Variations") || false;

  console.log('Languages for project:', project["Langues"]);

  return <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Project Details</h1>
              <p className="text-sm text-gray-500">ID: {project["ID-PROJET"]}</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <ProjectTimeline currentPhase={project["Phase"] || ''} />
          </CardContent>
        </Card>
        
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    {logoUrl && <div className="flex-shrink-0">
                        <img src={logoUrl} alt={`${project["Company"]} logo`} className="h-12 w-auto object-contain rounded-md" onError={e => {
                      console.error('Error loading logo:', e);
                      e.currentTarget.style.display = 'none';
                    }} />
                      </div>}
                    <div>
                      <h2 className="text-xl font-semibold">{project["Company"] || 'Untitled Project'}</h2>
                      
                    </div>
                  </div>
                  <StatusBadge status={project["Status"] || 'Unknown'} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 mt-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Start Date</p>
                        <p className="text-sm text-gray-500">{formatDate(project["Date de début"])}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Deadline</p>
                        <p className="text-sm text-gray-500">{formatDate(project["Deadline"])}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Duration</p>
                        <p className="text-sm text-gray-500">{project["Duration"] || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Company</p>
                        <p className="text-sm text-gray-500">{project["Company"] || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">Phase</p>
                        <p className="text-sm text-gray-500">{project["Phase"] || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {project["Script"] && <CollapsiblePreview title="Script Preview" icon={<FileText className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Copywriting" projectStatus={project["Status"]} externalUrl={project["Script"]} projectId={project["ID-PROJET"] || ''}>
                <ScriptPreview scriptUrl={project["Script"]} />
              </CollapsiblePreview>}
            
            {shouldShowVoiceOver && <CollapsiblePreview 
                title="Voice-Over Preview" 
                icon={<Headphones className="h-5 w-5" />} 
                currentPhase={project["Phase"] || ''} 
                relevantPhase="Voice" 
                projectStatus={project["Status"]} 
                projectId={project["ID-PROJET"] || ''}
                initialOpen={isVoiceOverPhase}
              >
                <VoiceOverPreview voiceFileUrl={project["Voice-file-url"] || ''} phase={project["Phase"] || ''} status={project["Status"] || ''} projectId={project["ID-PROJET"] || ''} languages={project["Langues"] || ''} />
              </CollapsiblePreview>}
            
            {project["Storyboard"] && <CollapsiblePreview title="Storyboard Preview" icon={<Image className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Storyboard" projectStatus={project["Status"]} externalUrl={project["Storyboard"]} projectId={project["ID-PROJET"] || ''}>
                <StoryboardPreview storyboardUrl={project["Storyboard"]} />
              </CollapsiblePreview>}
            
            {project["Animation"] && <CollapsiblePreview title="Animation Preview" icon={<Film className="h-5 w-5" />} currentPhase={project["Phase"] || ''} relevantPhase="Animation" projectStatus={project["Status"]} externalUrl={project["Animation"]} projectId={project["ID-PROJET"] || ''}>
                <AnimationPreview animationUrl={project["Animation"]} />
              </CollapsiblePreview>}
            
            {project["Variations-url"] && <CollapsiblePreview 
                title="Variations Preview" 
                icon={<Package className="h-5 w-5" />} 
                currentPhase={project["Phase"] || ''} 
                relevantPhase="Variations" 
                projectStatus={project["Status"]} 
                externalUrl={project["Variations-url"]} 
                projectId={project["ID-PROJET"] || ''}
                initialOpen={isVariationsPhase}
              >
                <VariationsPreview variationsUrl={project["Variations-url"]} />
              </CollapsiblePreview>}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <h3 className="font-semibold">Project Status</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Current Status</p>
                    <StatusBadge status={project["Status"] || 'Unknown'} className="mt-1" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phase</p>
                    <p className="text-sm mt-1">{project["Phase"] || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <ProjectCalendar startDate={project["Date de début"]} endDate={project["Deadline"]} />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Keyframe Project Manager © {new Date().getFullYear()}
        </div>
      </footer>
    </div>;
};

export default ProjectDetails;

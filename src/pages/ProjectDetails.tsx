
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Building, User, Clock, FileText, Image, Film, Headphones } from 'lucide-react';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ProjectDetails = () => {
  const { projectId } = useParams<{ projectId: string; }>();
  const [project, setProject] = useState<PipelineProject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [voiceOverOpen, setVoiceOverOpen] = useState(false);

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
        
        // Set voiceOverOpen based on current phase
        if (data && data.Phase) {
          setVoiceOverOpen(data.Phase.toLowerCase().includes('voice'));
        }
        
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

  // Debug log to check the value of Logo url
  console.log('Project Logo URL:', project["Logo url"]);
  
  // Access the Logo url more explicitly
  const logoUrl = project["Logo url"] || null;
  console.log('Logo URL (explicit):', logoUrl);
  
  // Check for Voice-file-url
  console.log('Voice file URL:', project["Voice-file-url"]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
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
                    {logoUrl && (
                      <div className="flex-shrink-0">
                        <img 
                          src={logoUrl} 
                          alt={`${project["Company"]} logo`} 
                          className="h-12 w-auto object-contain rounded-md"
                          onError={(e) => {
                            console.error('Error loading logo:', e);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-semibold">{project["Company"] || 'Untitled Project'}</h2>
                      <p className="text-gray-500">Client: {project["Client"] || 'N/A'}</p>
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
            
            {project["Storyboard"] && (
              <CollapsiblePreview 
                title="Storyboard Preview" 
                icon={<Image className="h-5 w-5" />}
                currentPhase={project["Phase"] || ''}
                relevantPhase="Storyboard"
                projectStatus={project["Status"]}
                externalUrl={project["Storyboard"]}
              >
                <StoryboardPreview storyboardUrl={project["Storyboard"]} />
              </CollapsiblePreview>
            )}
            
            {project["Script"] && (
              <CollapsiblePreview 
                title="Script Preview" 
                icon={<FileText className="h-5 w-5" />}
                currentPhase={project["Phase"] || ''}
                relevantPhase="Copywriting"
                projectStatus={project["Status"]}
                externalUrl={project["Script"]}
              >
                <ScriptPreview scriptUrl={project["Script"]} />
              </CollapsiblePreview>
            )}
            
            {project["Voice-file-url"] && (
              <Card className="mt-6">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Headphones className="h-5 w-5" />
                      Voice-Over Preview
                    </CardTitle>
                    <Collapsible 
                      open={voiceOverOpen} 
                      onOpenChange={setVoiceOverOpen}
                    >
                      <CollapsibleTrigger
                        className="rounded-full h-6 w-6 inline-flex items-center justify-center hover:bg-gray-100"
                      >
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className={`transform transition-transform ${voiceOverOpen ? 'rotate-180' : ''}`}
                        >
                          <path
                            d="M3.13523 6.15803C3.3241 5.95657 3.64052 5.94637 3.84197 6.13523L7.5 9.56464L11.158 6.13523C11.3595 5.94637 11.6759 5.95657 11.8648 6.15803C12.0536 6.35949 12.0434 6.67591 11.842 6.86477L7.84197 10.6148C7.64964 10.7951 7.35036 10.7951 7.15803 10.6148L3.15803 6.86477C2.95657 6.67591 2.94637 6.35949 3.13523 6.15803Z"
                            fill="currentColor"
                          />
                        </svg>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <VoiceOverPreview voiceFileUrl={project["Voice-file-url"] || ''} />
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                </CardHeader>
              </Card>
            )}
            
            {project["Animation"] && (
              <CollapsiblePreview 
                title="Animation Preview" 
                icon={<Film className="h-5 w-5" />}
                currentPhase={project["Phase"] || ''}
                relevantPhase="Animation"
                projectStatus={project["Status"]}
                externalUrl={project["Animation"]}
              >
                <AnimationPreview animationUrl={project["Animation"]} />
              </CollapsiblePreview>
            )}
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
            
            <ProjectCalendar 
              startDate={project["Date de début"]} 
              endDate={project["Deadline"]} 
            />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Keyframe Project Manager © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default ProjectDetails;

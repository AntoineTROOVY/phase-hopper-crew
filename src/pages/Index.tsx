import React, { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchProjects, PipelineProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PipelineProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const slackId = searchParams.get('slack-id');

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjects(slackId || undefined);
        setProjects(data);
        setFilteredProjects(data);
        
        if (slackId && data.length === 0) {
          toast({
            title: "No projects found",
            description: `No projects found for the provided Slack ID: ${slackId}`,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
        toast({
          title: "Error loading projects",
          description: "There was a problem loading your projects. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, [toast, slackId]);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        (project["ID-PROJET"]?.toLowerCase()?.includes(query) || false) ||
        (project["Company"]?.toLowerCase()?.includes(query) || false) ||
        (project["Client"]?.toLowerCase()?.includes(query) || false)
    );
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const statusCounts = {
    completed: projects.filter((p) => p.Status === 'Completed').length,
    inProgress: projects.filter((p) => p.Status === 'In Progress').length,
    atRisk: projects.filter((p) => p.Status === 'At Risk').length,
    onHold: projects.filter((p) => p.Status === 'On Hold').length,
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading projects...</h2>
          <p className="text-gray-500">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold text-gray-900">Keyframe Project Manager</h1>
          {slackId && (
            <p className="text-sm text-gray-500 mt-1">
              Viewing projects for Slack ID: {slackId}
            </p>
          )}
        </div>
      </header>
      
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-4xl">{projects.length}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-4xl text-green-600">{statusCounts.completed}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-4xl text-blue-600">{statusCounts.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>At Risk</CardDescription>
              <CardTitle className="text-4xl text-red-600">{statusCounts.atRisk}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Projects Overview</h2>
            <ProjectFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Projects</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="at-risk">At Risk</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects found.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="in-progress">
              {filteredProjects.filter(p => p.Status === 'In Progress').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No in-progress projects found.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProjects
                    .filter(p => p.Status === 'In Progress')
                    .map((project, index) => (
                      <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="at-risk">
              {filteredProjects.filter(p => p.Status === 'At Risk').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No at-risk projects found.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProjects
                    .filter(p => p.Status === 'At Risk')
                    .map((project, index) => (
                      <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
                    ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {filteredProjects.filter(p => p.Status === 'Completed').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No completed projects found.</p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProjects
                    .filter(p => p.Status === 'Completed')
                    .map((project, index) => (
                      <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
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

export default Dashboard;

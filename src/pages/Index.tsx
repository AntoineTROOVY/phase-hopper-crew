
import React, { useState, useEffect } from 'react';
import ProjectTable from '@/components/ProjectTable';
import ProjectFilter from '@/components/ProjectFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchProjects, PipelineProject } from '@/services/projectService';
import { useToast } from '@/components/ui/use-toast';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PipelineProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProjects();
        setProjects(data);
        setFilteredProjects(data);
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
  }, [toast]);

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
              <ProjectTable projects={filteredProjects} />
            </TabsContent>
            
            <TabsContent value="in-progress">
              <ProjectTable 
                projects={filteredProjects.filter(p => p.Status === 'In Progress')} 
              />
            </TabsContent>
            
            <TabsContent value="at-risk">
              <ProjectTable 
                projects={filteredProjects.filter(p => p.Status === 'At Risk')} 
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <ProjectTable 
                projects={filteredProjects.filter(p => p.Status === 'Completed')} 
              />
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

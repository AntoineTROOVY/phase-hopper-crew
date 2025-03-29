
import React, { useState, useEffect } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import { Card, CardContent } from '@/components/ui/card';
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
        const data = await fetchProjects();
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
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold">Projects Overview</h2>
            <ProjectFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </div>
          
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

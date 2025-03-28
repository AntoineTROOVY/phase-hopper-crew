
import React, { useState, useEffect } from 'react';
import { projects, Project } from '@/data/projects';
import ProjectTable from '@/components/ProjectTable';
import ProjectFilter from '@/components/ProjectFilter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(
      (project) =>
        project.id.toLowerCase().includes(query) ||
        project.companyName.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  }, [searchQuery]);

  const statusCounts = {
    completed: projects.filter((p) => p.status === 'Completed').length,
    inProgress: projects.filter((p) => p.status === 'In Progress').length,
    atRisk: projects.filter((p) => p.status === 'At Risk').length,
    onHold: projects.filter((p) => p.status === 'On Hold').length,
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold text-gray-900">Project Manager</h1>
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
                projects={filteredProjects.filter(p => p.status === 'In Progress')} 
              />
            </TabsContent>
            
            <TabsContent value="at-risk">
              <ProjectTable 
                projects={filteredProjects.filter(p => p.status === 'At Risk')} 
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <ProjectTable 
                projects={filteredProjects.filter(p => p.status === 'Completed')} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t py-4">
        <div className="container mx-auto text-center text-sm text-gray-500">
          Project Manager Dashboard © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

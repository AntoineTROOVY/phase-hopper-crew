
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import { fetchProjects, PipelineProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import { useBranding } from '@/contexts/BrandingContext';
import { ProjectStats } from '@/components/ProjectStats';
import { ArrowDown, ArrowUp, Filter, Package, Calendar, Grid, List } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

// Sort options for dropdown
type SortOption = 'newest' | 'oldest' | 'deadline-asc' | 'deadline-desc';
type ViewMode = 'grid' | 'list' | 'calendar';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PipelineProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [groupByPhase, setGroupByPhase] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const slackId = searchParams.get('slack-id');
  const { company, isLoading: isBrandingLoading } = useBranding();

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

  // Get unique phases from projects for filter options
  const phases = useMemo(() => {
    const uniquePhases = new Set<string>();
    projects.forEach(project => {
      if (project.Phase) {
        uniquePhases.add(project.Phase);
      }
    });
    return Array.from(uniquePhases).sort();
  }, [projects]);

  // Get unique statuses from projects for filter options
  const statuses = useMemo(() => {
    const uniqueStatuses = new Set<string>();
    projects.forEach(project => {
      if (project.Status) {
        uniqueStatuses.add(project.Status);
      }
    });
    return Array.from(uniqueStatuses).sort();
  }, [projects]);

  // Apply filters, search, and sorting
  useEffect(() => {
    let result = [...projects];
    
    // Apply text search
    const query = searchQuery.toLowerCase();
    if (query) {
      result = result.filter(
        (project) =>
          (project["ID-PROJET"]?.toLowerCase()?.includes(query) || false) ||
          (project["Company"]?.toLowerCase()?.includes(query) || false) ||
          (project["Client"]?.toLowerCase()?.includes(query) || false)
      );
    }
    
    // Apply phase filter
    if (phaseFilter) {
      result = result.filter(project => project.Phase === phaseFilter);
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(project => project.Status === statusFilter);
    }
    
    // Apply sorting
    result = sortProjects(result, sortOption);
    
    setFilteredProjects(result);
  }, [searchQuery, projects, phaseFilter, statusFilter, sortOption]);

  // Sort projects based on selected option
  const sortProjects = (projectsToSort: PipelineProject[], option: SortOption): PipelineProject[] => {
    return [...projectsToSort].sort((a, b) => {
      switch (option) {
        case 'newest':
          return compareDates(b["Date de début"], a["Date de début"]);
        case 'oldest':
          return compareDates(a["Date de début"], b["Date de début"]);
        case 'deadline-asc':
          return compareDates(a["Deadline"], b["Deadline"]);
        case 'deadline-desc':
          return compareDates(b["Deadline"], a["Deadline"]);
        default:
          return 0;
      }
    });
  };

  // Helper function to compare dates (handles null/undefined dates)
  const compareDates = (dateA: string | null | undefined, dateB: string | null | undefined): number => {
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    try {
      const dateObjA = new Date(dateA);
      const dateObjB = new Date(dateB);
      return dateObjA.getTime() - dateObjB.getTime();
    } catch (e) {
      return dateA.localeCompare(dateB);
    }
  };

  // Group projects by phase if grouping is enabled
  const groupedProjects = useMemo(() => {
    if (!groupByPhase) return null;
    
    const groups: Record<string, PipelineProject[]> = {};
    
    filteredProjects.forEach(project => {
      const phase = project.Phase || 'No Phase';
      if (!groups[phase]) {
        groups[phase] = [];
      }
      groups[phase].push(project);
    });
    
    return groups;
  }, [filteredProjects, groupByPhase]);

  // Count of completed projects (phase is "📦 Variations" and status is "Approved")
  const projectStats = useMemo(() => {
    const completed = projects.filter(p => 
      p.Phase === '📦 Variations' && p.Status === 'Approved'
    ).length;
    
    const inReview = projects.filter(p => 
      p.Status?.toLowerCase().includes('review')
    ).length;
    
    return {
      total: projects.length,
      completed,
      inProgress: projects.length - completed,
      inReview,
      filtered: filteredProjects.length
    };
  }, [projects, filteredProjects]);

  // Reset all filters
  const resetFilters = () => {
    setPhaseFilter(null);
    setStatusFilter(null);
    setSortOption('newest');
    setSearchQuery('');
    setGroupByPhase(false);
  };

  if (isLoading || isBrandingLoading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Loading projects...</h2>
            <p className="text-gray-500">Please wait while we fetch your data.</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">
            {company?.["Company Name"] ? `Company: ${company["Company Name"]}` : 'All projects'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Total Projects</p>
              <p className="text-3xl font-bold">{projectStats.total}</p>
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-3xl font-bold">{projectStats.inProgress}</p>
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-3xl font-bold">{projectStats.completed}</p>
            </div>
          </Card>
          <Card className="p-6 shadow-sm">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">In Review</p>
              <p className="text-3xl font-bold">{projectStats.inReview}</p>
            </div>
          </Card>
        </div>

        {/* Filter & View Controls */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div className="w-full lg:w-auto">
              <ProjectFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>
            
            <div className="flex flex-wrap gap-2 items-center w-full lg:w-auto">
              <Select value={phaseFilter || 'all'} onValueChange={(value) => setPhaseFilter(value === 'all' ? null : value)}>
                <SelectTrigger className="w-[130px] bg-white h-9">
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Phases</SelectItem>
                  {phases.map((phase) => (
                    <SelectItem key={phase} value={phase}>{phase}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter || 'all'} onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}>
                <SelectTrigger className="w-[130px] bg-white h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                <SelectTrigger className="w-[130px] bg-white h-9">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-3.5 w-3.5" /> Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="oldest">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-3.5 w-3.5" /> Oldest First
                    </div>
                  </SelectItem>
                  <SelectItem value="deadline-asc">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="h-3.5 w-3.5" /> Deadline (Soon)
                    </div>
                  </SelectItem>
                  <SelectItem value="deadline-desc">
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-3.5 w-3.5" /> Deadline (Later)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)} className="ml-auto">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="grid" className="data-[state=active]:bg-white">
                    <Grid className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list" className="data-[state=active]:bg-white">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="data-[state=active]:bg-white">
                    <Calendar className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setGroupByPhase(!groupByPhase)}
                className={groupByPhase ? 'bg-gray-100' : ''}
              >
                <Package className="mr-2 h-4 w-4" />
                Group by Phase
              </Button>
              
              {(phaseFilter || statusFilter || sortOption !== 'newest' || searchQuery || groupByPhase) && (
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-12 w-12 text-gray-400 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Package className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No projects found</h3>
              <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
            </div>
          ) : groupByPhase && groupedProjects ? (
            // Grouped projects display
            <div className="space-y-10">
              {Object.entries(groupedProjects).sort().map(([phase, phaseProjects]) => (
                <div key={phase} className="space-y-4">
                  <div className="flex items-center gap-2 border-b pb-2">
                    <h3 className="text-lg font-medium">{phase}</h3>
                    <Badge variant="secondary">{phaseProjects.length}</Badge>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {phaseProjects.map((project, index) => (
                      <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : viewMode === 'grid' ? (
            // Regular projects grid
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
              ))}
            </div>
          ) : viewMode === 'list' ? (
            // List view
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project, index) => (
                    <tr key={`${project["ID-PROJET"]}-${index}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <a href={`/project/${project["ID-PROJET"]}`}>{project["ID-PROJET"]}</a>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project["Client"]}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project["Phase"]}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project["Status"] === "Approved" ? "bg-green-100 text-green-800" : 
                          project["Status"]?.includes("Review") ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {project["Status"]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project["Deadline"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Calendar view - Placeholder for now
            <div className="bg-gray-50 rounded-lg border p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <Calendar className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View Coming Soon</h3>
                <p className="text-gray-500 max-w-md">This feature is under development and will be available in a future update.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

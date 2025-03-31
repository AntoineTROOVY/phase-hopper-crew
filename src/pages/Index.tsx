
import React, { useState, useEffect, useMemo } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ProjectFilter from '@/components/ProjectFilter';
import { fetchProjects, PipelineProject } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import AppFooter from '@/components/AppFooter';
import { useBranding } from '@/contexts/BrandingContext';
import { ProjectStats } from '@/components/ProjectStats';
import { ArrowDown, ArrowUp, Filter, Package } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Sort options for dropdown
type SortOption = 'newest' | 'oldest' | 'deadline-asc' | 'deadline-desc';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<PipelineProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PipelineProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [phaseFilter, setPhaseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [groupByPhase, setGroupByPhase] = useState(false);
  
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
      <AppHeader 
        title="Project Manager" 
        subtitle={slackId ? `Company: ${company?.["Company Name"] || slackId}` : undefined}
      />
      
      <main className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 flex-1">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold">Projects Overview</h2>
              <ProjectStats stats={projectStats} />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <ProjectFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              
              <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
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
                
                <button 
                  onClick={() => setGroupByPhase(!groupByPhase)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium h-9
                    ${groupByPhase 
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                >
                  <Package className="h-3.5 w-3.5" />
                  {groupByPhase ? 'Ungroup' : 'Group by Phase'}
                </button>
                
                {(phaseFilter || statusFilter || sortOption !== 'newest' || searchQuery || groupByPhase) && (
                  <button 
                    onClick={resetFilters}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-gray-300 bg-white hover:bg-gray-50 h-9"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {filteredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No projects found matching the current filters.</p>
            </div>
          ) : groupByPhase && groupedProjects ? (
            // Grouped projects display
            <div className="space-y-6">
              {Object.entries(groupedProjects).sort().map(([phase, phaseProjects]) => (
                <div key={phase} className="space-y-3">
                  <div className="flex items-center gap-2">
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
          ) : (
            // Regular projects grid
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={`${project["ID-PROJET"]}-${index}`} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default Dashboard;

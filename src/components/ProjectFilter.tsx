
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface ProjectFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="search"
        placeholder="Search projects by ID or company..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full bg-white"
      />
    </div>
  );
};

export default ProjectFilter;

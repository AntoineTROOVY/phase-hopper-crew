
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import StatusBadge from './StatusBadge';
import { PipelineProject } from '@/services/projectService';

interface ProjectTableProps {
  projects: PipelineProject[];
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects }) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not set';
    
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString; // If the date can't be parsed, return the original string
    }
  };

  return (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Project ID</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Deadline</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project, index) => (
              <TableRow key={project["ID-PROJET"] || index} className="hover:bg-gray-50">
                <TableCell className="font-medium">{project["ID-PROJET"] || 'N/A'}</TableCell>
                <TableCell>{project["Company"] || 'N/A'}</TableCell>
                <TableCell>{project["Client"] || 'N/A'}</TableCell>
                <TableCell>{project["Phase"] || 'N/A'}</TableCell>
                <TableCell>
                  <StatusBadge status={project["Status"] || 'Unknown'} />
                </TableCell>
                <TableCell>{formatDate(project["Date de début"])}</TableCell>
                <TableCell>{formatDate(project["Deadline"])}</TableCell>
                <TableCell>{project["Duration"] || 'N/A'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectTable;

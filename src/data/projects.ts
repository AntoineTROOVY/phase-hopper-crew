
export type ProjectStatus = 'Completed' | 'In Progress' | 'At Risk' | 'On Hold';
export type ProjectPhase = 'Planning' | 'Design' | 'Development' | 'Testing' | 'Deployment' | 'Maintenance';

export interface Project {
  id: string;
  companyName: string;
  phase: ProjectPhase;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
}

export const projects: Project[] = [
  {
    id: 'PRJ-001',
    companyName: 'TechNova Solutions',
    phase: 'Development',
    status: 'In Progress',
    startDate: '2023-09-15',
    endDate: '2023-12-20',
  },
  {
    id: 'PRJ-002',
    companyName: 'Global Finance Group',
    phase: 'Testing',
    status: 'At Risk',
    startDate: '2023-07-10',
    endDate: '2023-11-30',
  },
  {
    id: 'PRJ-003',
    companyName: 'HealthPlus Medical',
    phase: 'Deployment',
    status: 'Completed',
    startDate: '2023-05-20',
    endDate: '2023-10-15',
  },
  {
    id: 'PRJ-004',
    companyName: 'EcoSmart Energy',
    phase: 'Planning',
    status: 'On Hold',
    startDate: '2023-10-01',
  },
  {
    id: 'PRJ-005',
    companyName: 'Retail Connect',
    phase: 'Design',
    status: 'In Progress',
    startDate: '2023-08-05',
    endDate: '2023-12-10',
  },
  {
    id: 'PRJ-006',
    companyName: 'Cyber Shield',
    phase: 'Development',
    status: 'In Progress',
    startDate: '2023-09-01',
    endDate: '2024-01-15',
  },
  {
    id: 'PRJ-007',
    companyName: 'Media Vision Studios',
    phase: 'Maintenance',
    status: 'Completed',
    startDate: '2023-03-10',
    endDate: '2023-09-30',
  },
  {
    id: 'PRJ-008',
    companyName: 'Urban Architecture',
    phase: 'Design',
    status: 'At Risk',
    startDate: '2023-07-20',
    endDate: '2023-11-15',
  },
];

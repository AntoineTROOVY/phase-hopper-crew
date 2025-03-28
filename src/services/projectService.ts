
import { supabase } from "@/integrations/supabase/client";

export interface PipelineProject {
  "ID-PROJET"?: string | null;
  "Company"?: string | null;
  "Phase"?: string | null;
  "Status"?: string | null;
  "Date de début"?: string | null;
  "Deadline"?: string | null;
  "Client"?: string | null;
  "Duration"?: string | null;
  "Animation"?: string | null;
}

export const fetchProjects = async (): Promise<PipelineProject[]> => {
  const { data, error } = await supabase
    .from("PIPELINE PROJET")
    .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Animation"');
  
  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data || [];
};

export const fetchProjectById = async (projectId: string): Promise<PipelineProject | null> => {
  try {
    const { data, error } = await supabase
      .from("PIPELINE PROJET")
      .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Animation"')
      .eq("ID-PROJET", projectId)
      .limit(1);
    
    if (error) {
      console.error("Error fetching project:", error);
      throw error;
    }

    // Return the first item from the array or null if empty
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

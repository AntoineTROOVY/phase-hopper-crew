
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
  "Storyboard"?: string | null;
  "Script"?: string | null;
  "Logo url"?: string | null;
  "Voice-file-url"?: string | null;
  "Langues"?: string | null;
  "Variations-url"?: string | null;
}

export const fetchProjects = async (): Promise<PipelineProject[]> => {
  const { data, error } = await supabase
    .from("PIPELINE PROJECTS")
    .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Animation", "Storyboard", "Script", "Logo url", "Voice-file-url", "Langues", "Variations-url"');
  
  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data || [];
};

export const fetchProjectById = async (projectId: string): Promise<PipelineProject | null> => {
  try {
    // First attempt to get all matching records
    const { data, error } = await supabase
      .from("PIPELINE PROJECTS")
      .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Animation", "Storyboard", "Script", "Logo url", "Voice-file-url", "Langues", "Variations-url"')
      .eq("ID-PROJET", projectId);
    
    if (error) {
      console.error("Error fetching project:", error);
      throw error;
    }

    // If no data or empty array, return null
    if (!data || data.length === 0) {
      return null;
    }

    // Return the first match if multiple records exist
    return data[0];
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

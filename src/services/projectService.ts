
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
  "Slack ID"?: string | null;
}

export const fetchProjects = async (slackId?: string): Promise<PipelineProject[]> => {
  // If no slackId is provided, return an empty array (making projects private by default)
  if (!slackId) {
    return [];
  }
  
  let query = supabase
    .from("PIPELINE PROJET")
    .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Slack ID"');
  
  // Apply Slack ID filter if provided
  query = query.eq("Slack ID", slackId);
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data || [];
};

export const fetchProjectById = async (projectId: string, slackId?: string): Promise<PipelineProject | null> => {
  try {
    let query = supabase
      .from("PIPELINE PROJET")
      .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Slack ID"')
      .eq("ID-PROJET", projectId);
    
    // If slackId is provided, add it as a filter
    if (slackId) {
      query = query.eq("Slack ID", slackId);
    }
    
    // Use limit(1) to only get the first matching record when there are duplicates
    const { data, error } = await query.limit(1);

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

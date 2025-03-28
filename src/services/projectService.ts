
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
  let query = supabase
    .from("PIPELINE PROJET")
    .select('"ID-PROJET", "Company", "Phase", "Status", "Date de début", "Deadline", "Client", "Duration", "Slack ID"');
  
  // Apply Slack ID filter if provided
  if (slackId) {
    query = query.eq("Slack ID", slackId);
  }
  
  const { data, error } = await query;

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data || [];
};

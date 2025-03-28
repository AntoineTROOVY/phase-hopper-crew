
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
}

export const fetchProjects = async (): Promise<PipelineProject[]> => {
  const { data, error } = await supabase
    .from("PIPELINE PROJET")
    .select("ID-PROJET, Company, Phase, Status, Date de début, Deadline, Client, Duration");

  if (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }

  return data || [];
};

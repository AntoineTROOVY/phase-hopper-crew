
import { supabase } from "@/integrations/supabase/client";

export interface Company {
  "Company Name"?: string | null;
  "SLACK ID"?: string | null;
  "Interface logo url"?: string | null;
  "Interface name"?: string | null;
  "Logo url"?: string | null;
}

export const fetchCompanyBySlackId = async (slackId: string): Promise<Company | null> => {
  try {
    const { data, error } = await supabase
      .from("COMPANY")
      .select('"Company Name", "SLACK ID", "Interface logo url", "Interface name", "Logo url"')
      .eq("SLACK ID", slackId)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching company by Slack ID:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in fetchCompanyBySlackId:", error);
    throw error;
  }
};

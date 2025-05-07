export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      COMPANY: {
        Row: {
          "Business sector": string | null
          Clients: string | null
          "Company Name": string
          Country: string | null
          "Full address": string | null
          "Interface logo url": string | null
          "Interface name": string | null
          Language: string | null
          "Legal company name for invoice": string | null
          "Logo url": string | null
          "PIPELINE PROJECT": string | null
          Role: string | null
          SIREN: string | null
          "SLACK ID": string | null
          "TVA status": string | null
          "VAT Number": string | null
          Website: string | null
          whalesync_postgres_id: string
        }
        Insert: {
          "Business sector"?: string | null
          Clients?: string | null
          "Company Name": string
          Country?: string | null
          "Full address"?: string | null
          "Interface logo url"?: string | null
          "Interface name"?: string | null
          Language?: string | null
          "Legal company name for invoice"?: string | null
          "Logo url"?: string | null
          "PIPELINE PROJECT"?: string | null
          Role?: string | null
          SIREN?: string | null
          "SLACK ID"?: string | null
          "TVA status"?: string | null
          "VAT Number"?: string | null
          Website?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          "Business sector"?: string | null
          Clients?: string | null
          "Company Name"?: string
          Country?: string | null
          "Full address"?: string | null
          "Interface logo url"?: string | null
          "Interface name"?: string | null
          Language?: string | null
          "Legal company name for invoice"?: string | null
          "Logo url"?: string | null
          "PIPELINE PROJECT"?: string | null
          Role?: string | null
          SIREN?: string | null
          "SLACK ID"?: string | null
          "TVA status"?: string | null
          "VAT Number"?: string | null
          Website?: string | null
          whalesync_postgres_id?: string
        }
        Relationships: []
      }
      CRM: {
        Row: {
          "Business segment": string | null
          COMPANY: string | null
          Email: string
          "First name": string | null
          Instagram: string | null
          "Joined date": string | null
          Language: string | null
          "Last name": string | null
          Linkedin: string | null
          LTV: string | null
          "Phone number": string | null
          "PIPELINE PROJECT": string | null
          "Slack id": string | null
          Status: string | null
          "Total Deliverables": string | null
          Twitter: string | null
          "Video gratuite 1": string | null
          whalesync_postgres_id: string
        }
        Insert: {
          "Business segment"?: string | null
          COMPANY?: string | null
          Email: string
          "First name"?: string | null
          Instagram?: string | null
          "Joined date"?: string | null
          Language?: string | null
          "Last name"?: string | null
          Linkedin?: string | null
          LTV?: string | null
          "Phone number"?: string | null
          "PIPELINE PROJECT"?: string | null
          "Slack id"?: string | null
          Status?: string | null
          "Total Deliverables"?: string | null
          Twitter?: string | null
          "Video gratuite 1"?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          "Business segment"?: string | null
          COMPANY?: string | null
          Email?: string
          "First name"?: string | null
          Instagram?: string | null
          "Joined date"?: string | null
          Language?: string | null
          "Last name"?: string | null
          Linkedin?: string | null
          LTV?: string | null
          "Phone number"?: string | null
          "PIPELINE PROJECT"?: string | null
          "Slack id"?: string | null
          Status?: string | null
          "Total Deliverables"?: string | null
          Twitter?: string | null
          "Video gratuite 1"?: string | null
          whalesync_postgres_id?: string
        }
        Relationships: []
      }
      motion_design_projects: {
        Row: {
          company_name: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          phase: string
          project_name: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          phase?: string
          project_name: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          phase?: string
          project_name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      "PIPELINE PROJECTS": {
        Row: {
          Animation: string | null
          "Assigned members": string | null
          Autonumber: number | null
          "Brief main": string | null
          Client: string | null
          Collected: string | null
          Company: string | null
          "Company link": string | null
          Contracted: string | null
          "Date de début": string | null
          Deadline: string | null
          "Deadline phrase": string | null
          "Drive folder": string | null
          Duration: string | null
          Email: string | null
          "First name": string | null
          Format: string | null
          "Google doc id": string | null
          "Hook varitions": string | null
          "ID-PROJET": string
          Invoice: string | null
          "Languages-number": number | null
          Langues: string | null
          "Linked company": string | null
          "Logo url": string | null
          "Num version video": string | null
          OPERATIONS: string | null
          "OPERATIONS copy": string | null
          "OPERATIONS TEMPLATE copy": string | null
          OPERATIONSS: string | null
          PAYROLL: string | null
          Phase: string | null
          "Plan de paiement": string | null
          Progression: string | null
          "Progression phrase": string | null
          "Record id": string | null
          Script: string | null
          "Slack ID": string | null
          "Slack language": string | null
          Status: string | null
          Storyboard: string | null
          "Test voix autre colonne": string | null
          "Variations-url": string | null
          "Voice overs list string": string | null
          "Voice-file": string | null
          "Voice-file-url": string | null
          "Voice-links": string | null
          "Voix-off": string | null
          whalesync_postgres_id: string
        }
        Insert: {
          Animation?: string | null
          "Assigned members"?: string | null
          Autonumber?: number | null
          "Brief main"?: string | null
          Client?: string | null
          Collected?: string | null
          Company?: string | null
          "Company link"?: string | null
          Contracted?: string | null
          "Date de début"?: string | null
          Deadline?: string | null
          "Deadline phrase"?: string | null
          "Drive folder"?: string | null
          Duration?: string | null
          Email?: string | null
          "First name"?: string | null
          Format?: string | null
          "Google doc id"?: string | null
          "Hook varitions"?: string | null
          "ID-PROJET": string
          Invoice?: string | null
          "Languages-number"?: number | null
          Langues?: string | null
          "Linked company"?: string | null
          "Logo url"?: string | null
          "Num version video"?: string | null
          OPERATIONS?: string | null
          "OPERATIONS copy"?: string | null
          "OPERATIONS TEMPLATE copy"?: string | null
          OPERATIONSS?: string | null
          PAYROLL?: string | null
          Phase?: string | null
          "Plan de paiement"?: string | null
          Progression?: string | null
          "Progression phrase"?: string | null
          "Record id"?: string | null
          Script?: string | null
          "Slack ID"?: string | null
          "Slack language"?: string | null
          Status?: string | null
          Storyboard?: string | null
          "Test voix autre colonne"?: string | null
          "Variations-url"?: string | null
          "Voice overs list string"?: string | null
          "Voice-file"?: string | null
          "Voice-file-url"?: string | null
          "Voice-links"?: string | null
          "Voix-off"?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          Animation?: string | null
          "Assigned members"?: string | null
          Autonumber?: number | null
          "Brief main"?: string | null
          Client?: string | null
          Collected?: string | null
          Company?: string | null
          "Company link"?: string | null
          Contracted?: string | null
          "Date de début"?: string | null
          Deadline?: string | null
          "Deadline phrase"?: string | null
          "Drive folder"?: string | null
          Duration?: string | null
          Email?: string | null
          "First name"?: string | null
          Format?: string | null
          "Google doc id"?: string | null
          "Hook varitions"?: string | null
          "ID-PROJET"?: string
          Invoice?: string | null
          "Languages-number"?: number | null
          Langues?: string | null
          "Linked company"?: string | null
          "Logo url"?: string | null
          "Num version video"?: string | null
          OPERATIONS?: string | null
          "OPERATIONS copy"?: string | null
          "OPERATIONS TEMPLATE copy"?: string | null
          OPERATIONSS?: string | null
          PAYROLL?: string | null
          Phase?: string | null
          "Plan de paiement"?: string | null
          Progression?: string | null
          "Progression phrase"?: string | null
          "Record id"?: string | null
          Script?: string | null
          "Slack ID"?: string | null
          "Slack language"?: string | null
          Status?: string | null
          Storyboard?: string | null
          "Test voix autre colonne"?: string | null
          "Variations-url"?: string | null
          "Voice overs list string"?: string | null
          "Voice-file"?: string | null
          "Voice-file-url"?: string | null
          "Voice-links"?: string | null
          "Voix-off"?: string | null
          whalesync_postgres_id?: string
        }
        Relationships: []
      }
      VARIATIONS: {
        Row: {
          Cost: number | null
          Duration: string | null
          Format: string | null
          ID: number
          Language: string | null
          "Langues (from Project)": string | null
          "Link (from Voicer)": string | null
          "Name (from Voicer)": string | null
          Phrase: string | null
          "Phrase copy": string | null
          Project: string | null
          "Record-id-project": string | null
          Voicer: string | null
          whalesync_postgres_id: string
        }
        Insert: {
          Cost?: number | null
          Duration?: string | null
          Format?: string | null
          ID: number
          Language?: string | null
          "Langues (from Project)"?: string | null
          "Link (from Voicer)"?: string | null
          "Name (from Voicer)"?: string | null
          Phrase?: string | null
          "Phrase copy"?: string | null
          Project?: string | null
          "Record-id-project"?: string | null
          Voicer?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          Cost?: number | null
          Duration?: string | null
          Format?: string | null
          ID?: number
          Language?: string | null
          "Langues (from Project)"?: string | null
          "Link (from Voicer)"?: string | null
          "Name (from Voicer)"?: string | null
          Phrase?: string | null
          "Phrase copy"?: string | null
          Project?: string | null
          "Record-id-project"?: string | null
          Voicer?: string | null
          whalesync_postgres_id?: string
        }
        Relationships: []
      }
      "Voice-overs": {
        Row: {
          Gender: string | null
          Language: string | null
          Link: string | null
          Name: string
          "OPERATIONS TEMPLATE": string | null
          "PIPELINE PROJECT": string | null
          Preview: string | null
          "Profil pic": string | null
          whalesync_postgres_id: string
        }
        Insert: {
          Gender?: string | null
          Language?: string | null
          Link?: string | null
          Name: string
          "OPERATIONS TEMPLATE"?: string | null
          "PIPELINE PROJECT"?: string | null
          Preview?: string | null
          "Profil pic"?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          Gender?: string | null
          Language?: string | null
          Link?: string | null
          Name?: string
          "OPERATIONS TEMPLATE"?: string | null
          "PIPELINE PROJECT"?: string | null
          Preview?: string | null
          "Profil pic"?: string | null
          whalesync_postgres_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

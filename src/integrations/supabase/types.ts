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
          Language: string | null
          "Legal company name for invoice": string | null
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
          Language?: string | null
          "Legal company name for invoice"?: string | null
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
          Language?: string | null
          "Legal company name for invoice"?: string | null
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
          Additionals_formats: string | null
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
          "Voice overs list string": string | null
          "Voice-file": string | null
          "Voice-file-url": string | null
          "Voice-links": string | null
          "Voix-off": string | null
          whalesync_postgres_id: string
        }
        Insert: {
          Additionals_formats?: string | null
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
          "Voice overs list string"?: string | null
          "Voice-file"?: string | null
          "Voice-file-url"?: string | null
          "Voice-links"?: string | null
          "Voix-off"?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          Additionals_formats?: string | null
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
          "Voice overs list string"?: string | null
          "Voice-file"?: string | null
          "Voice-file-url"?: string | null
          "Voice-links"?: string | null
          "Voix-off"?: string | null
          whalesync_postgres_id?: string
        }
        Relationships: []
      }
      "PIPELINE PROJET": {
        Row: {
          Additionals_formats: string | null
          Animation: string | null
          "Assigned members": string | null
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
          "Google doc id": string | null
          "Hook varitions": string | null
          "ID-PROJET": string | null
          Invoice: string | null
          "Languages-number": number | null
          Langues: string | null
          "Linked company": string | null
          "Logo url": string | null
          "Num version video": string | null
          OPERATIONS: string | null
          OPERATIONSS: string | null
          PAYROLL: string | null
          Phase: string | null
          "Plan de paiement": string | null
          Script: string | null
          "Slack ID": string | null
          "Slack language": string | null
          Status: string | null
          Storyboard: string | null
          "Test voix autre colonne": string | null
          "Voice overs list string": string | null
          "Voice-file": string | null
          "Voice-links": string | null
          "Voix-off": string | null
          whalesync_postgres_id: string
        }
        Insert: {
          Additionals_formats?: string | null
          Animation?: string | null
          "Assigned members"?: string | null
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
          "Google doc id"?: string | null
          "Hook varitions"?: string | null
          "ID-PROJET"?: string | null
          Invoice?: string | null
          "Languages-number"?: number | null
          Langues?: string | null
          "Linked company"?: string | null
          "Logo url"?: string | null
          "Num version video"?: string | null
          OPERATIONS?: string | null
          OPERATIONSS?: string | null
          PAYROLL?: string | null
          Phase?: string | null
          "Plan de paiement"?: string | null
          Script?: string | null
          "Slack ID"?: string | null
          "Slack language"?: string | null
          Status?: string | null
          Storyboard?: string | null
          "Test voix autre colonne"?: string | null
          "Voice overs list string"?: string | null
          "Voice-file"?: string | null
          "Voice-links"?: string | null
          "Voix-off"?: string | null
          whalesync_postgres_id?: string
        }
        Update: {
          Additionals_formats?: string | null
          Animation?: string | null
          "Assigned members"?: string | null
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
          "Google doc id"?: string | null
          "Hook varitions"?: string | null
          "ID-PROJET"?: string | null
          Invoice?: string | null
          "Languages-number"?: number | null
          Langues?: string | null
          "Linked company"?: string | null
          "Logo url"?: string | null
          "Num version video"?: string | null
          OPERATIONS?: string | null
          OPERATIONSS?: string | null
          PAYROLL?: string | null
          Phase?: string | null
          "Plan de paiement"?: string | null
          Script?: string | null
          "Slack ID"?: string | null
          "Slack language"?: string | null
          Status?: string | null
          Storyboard?: string | null
          "Test voix autre colonne"?: string | null
          "Voice overs list string"?: string | null
          "Voice-file"?: string | null
          "Voice-links"?: string | null
          "Voix-off"?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

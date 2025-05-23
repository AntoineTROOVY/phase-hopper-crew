import { supabase } from "@/integrations/supabase/client";
import Airtable from 'airtable';

// Nouvelle configuration Airtable
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pata4KxDhV4JwzJmZ.12a6dbcc38032d0da0514e2fec16fa9e03653292b920775c4d2db56570821d3b';
const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
const AIRTABLE_TABLE_NAME = 'PIPELINE PROJECT';

const base = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(AIRTABLE_BASE_ID);

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
  "Brief main"?: string | null;
  "Voice-file"?: any[] | null;
  "Voice-Over"?: boolean;
  "Hook variations"?: string[] | string | null;
  recordId?: string;
}

// Nouvelle fonction pour récupérer les projets depuis Airtable
export const fetchProjects = async (): Promise<PipelineProject[]> => {
  return new Promise((resolve, reject) => {
    const results: PipelineProject[] = [];
    base(AIRTABLE_TABLE_NAME)
      .select({
        fields: [
          'ID-PROJET', 'Company', 'Phase', 'Status', 'Date de début', 'Deadline', 'Client', 'Duration',
          'Animation', 'Storyboard', 'Script', 'Logo url', 'Voice-file-url', 'Langues', 'Variations-url', 
          'Brief main', 'Voice-file', 'Voice-Over', 'Hook variations'
        ],
        view: 'Grid view',
        maxRecords: 100
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function(record) {
            const fields = record.fields as any;
            results.push({
              recordId: record.id,
              "Voice-file": fields["Voice-file"] || null,
              "ID-PROJET": fields["ID-PROJET"] || null,
              "Company": fields["Company"] || null,
              "Phase": fields["Phase"] || null,
              "Status": fields["Status"] || null,
              "Date de début": fields["Date de début"] || null,
              "Deadline": fields["Deadline"] || null,
              "Client": fields["Client"] || null,
              "Duration": fields["Duration"] ? String(fields["Duration"]) : null,
              "Animation": fields["Animation"] || null,
              "Storyboard": fields["Storyboard"] || null,
              "Script": fields["Script"] || null,
              "Logo url": Array.isArray(fields["Logo url"]) ? fields["Logo url"][0] : fields["Logo url"] || null,
              "Voice-file-url": fields["Voice-file-url"] || null,
              "Langues": fields["Langues"] || null,
              "Variations-url": fields["Variations-url"] || null,
              "Brief main": fields["Brief main"] || null,
              "Voice-Over": fields["Voice-Over"] || false,
              "Hook variations": fields["Hook variations"] || null,
            });
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error('Error fetching projects from Airtable:', err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
  });
};

export const fetchProjectById = async (projectId: string): Promise<PipelineProject | null> => {
  return new Promise((resolve, reject) => {
    base(AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `({ID-PROJET} = '${projectId}')`,
        fields: [
          'ID-PROJET', 'Company', 'Phase', 'Status', 'Date de début', 'Deadline', 'Client', 'Duration',
          'Animation', 'Storyboard', 'Script', 'Logo url', 'Voice-file-url', 'Langues', 'Variations-url', 
          'Brief main', 'Voice-file', 'Voice-Over', 'Hook variations'
        ],
        view: 'Grid view',
        maxRecords: 1
      })
      .firstPage(function(err, records) {
        if (err) {
          console.error('Error fetching project by ID from Airtable:', err);
          reject(err);
        } else if (!records || records.length === 0) {
          resolve(null);
        } else {
          const fields = records[0].fields as any;
          resolve({
            recordId: records[0].id,
            "Voice-file": fields["Voice-file"] || null,
            "ID-PROJET": fields["ID-PROJET"] || null,
            "Company": fields["Company"] || null,
            "Phase": fields["Phase"] || null,
            "Status": fields["Status"] || null,
            "Date de début": fields["Date de début"] || null,
            "Deadline": fields["Deadline"] || null,
            "Client": fields["Client"] || null,
            "Duration": fields["Duration"] ? String(fields["Duration"]) : null,
            "Animation": fields["Animation"] || null,
            "Storyboard": fields["Storyboard"] || null,
            "Script": fields["Script"] || null,
            "Logo url": Array.isArray(fields["Logo url"]) ? fields["Logo url"][0] : fields["Logo url"] || null,
            "Voice-file-url": fields["Voice-file-url"] || null,
            "Langues": fields["Langues"] || null,
            "Variations-url": fields["Variations-url"] || null,
            "Brief main": fields["Brief main"] || null,
            "Voice-Over": fields["Voice-Over"] || false,
            "Hook variations": fields["Hook variations"] || null,
          });
        }
      });
  });
};

// Nouvelle interface pour les voix-off depuis Airtable
export interface AirtableVoiceOver {
  id: string; // record ID d'Airtable
  Name: string;
  Gender: string;
  Language: string;
  ProfilPic?: any[]; // array d'attachments
  Preview?: any[]; // array d'attachments
}

// Fonction pour récupérer toutes les voix-off depuis Airtable (avec field IDs et returnFieldsByFieldId)
export const fetchVoiceOversFromAirtable = async (): Promise<AirtableVoiceOver[]> => {
  return new Promise((resolve, reject) => {
    const results: AirtableVoiceOver[] = [];
    base('Voice-overs')
      .select({
        fields: [
          'fldRLTYgQVrkvLebh', // Name
          'fldzB3ZtHNG1ky7rX', // Gender
          'fldtCGLHLXHSqGOvg', // Language
          'fldY8SJv9zMeG7EtY', // Profil pic
          'fldtJkdhALwvvz9Ly'  // Preview
        ],
        view: 'Grid view',
        maxRecords: 100,
        returnFieldsByFieldId: true
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function(record) {
            const fields = record.fields as any;
            results.push({
              id: record.id,
              Name: fields['fldRLTYgQVrkvLebh'] || '',
              Gender: fields['fldzB3ZtHNG1ky7rX'] || '',
              Language: fields['fldtCGLHLXHSqGOvg'] || '',
              ProfilPic: Array.isArray(fields['fldY8SJv9zMeG7EtY']) ? fields['fldY8SJv9zMeG7EtY'] : [],
              Preview: Array.isArray(fields['fldtJkdhALwvvz9Ly']) ? fields['fldtJkdhALwvvz9Ly'] : [],
            });
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error('Error fetching voice-overs from Airtable:', err);
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
  });
};

// Fonction utilitaire pour récupérer le record ID Airtable à partir de l'ID métier (ID-PROJET)
export const fetchAirtableRecordIdByProjectId = async (projectId: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    base(AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `({ID-PROJET} = '${projectId}')`,
        fields: ['ID-PROJET'],
        maxRecords: 1
      })
      .firstPage(function(err, records) {
        if (err) {
          console.error('Error fetching Airtable record ID by projectId:', err);
          reject(err);
        } else if (!records || records.length === 0) {
          resolve(null);
        } else {
          resolve(records[0].id);
        }
      });
  });
};

// Met à jour le champ Voix-off d'un projet dans Airtable
export const updateProjectVoiceOvers = async (projectRecordId: string, voiceOverRecordIds: string[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    base(AIRTABLE_TABLE_NAME).update([
      {
        id: projectRecordId,
        fields: {
          'flduhYdddEe8VEILa': voiceOverRecordIds // Champ Voix-off (array de record IDs)
        }
      }
    ], function(err, records) {
      if (err) {
        console.error('Error updating Voix-off in Airtable:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

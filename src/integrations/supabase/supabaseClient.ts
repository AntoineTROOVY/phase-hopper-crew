import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://evpqacvcwevngzglqtto.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2cHFhY3Zjd2V2bmd6Z2xxdHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODQ3OTcsImV4cCI6MjA2MjU2MDc5N30.JAPGYY_gOViOD15zD7ChGfh4sZ26jaHrm306Zsm2a0M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: localStorage,
  },
});

// Fonction utilitaire pour vérifier l'email dans la table CRM d'Airtable
const AIRTABLE_API_KEY = 'patnjkdfpm7seARLU.1c75c39e22eb8ff9b239e3938b299cab217dd76b246f48d4d5b79db3bcf68bbe'; // Mets ici ta clé API Airtable
const AIRTABLE_BASE_ID = 'appxw8yeMj2p3m4Aa';
const CRM_TABLE = 'CRM';

export async function getCRMUserByEmail(email: string) {
  const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${CRM_TABLE}?filterByFormula=LOWER({Email})='${encodeURIComponent(email.toLowerCase())}'&fields[]=First%20name&fields[]=Profil%20picture&fields[]=Email`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
    },
  });
  const data = await res.json();
  if (data.records && data.records.length > 0) {
    const record = data.records[0];
    return {
      firstName: record.fields['First name'],
      email: record.fields['Email'],
      profilePicture: record.fields['Profil picture']?.[0]?.thumbnails?.small?.url || record.fields['Profil picture']?.[0]?.url || null,
    };
  }
  return null;
} 
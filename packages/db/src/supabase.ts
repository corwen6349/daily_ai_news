import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getConfig } from '@daily-ai-news/config';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  const { supabaseUrl, supabaseAnonKey } = getConfig();
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return supabaseClient;
}

export function hasSupabaseConfig(): boolean {
  const { supabaseUrl, supabaseAnonKey } = getConfig();
  return Boolean(supabaseUrl && supabaseAnonKey);
}

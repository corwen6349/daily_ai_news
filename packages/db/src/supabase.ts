import { createClient } from '@supabase/supabase-js';
import { getConfig } from '@daily-ai-news/config';

export function getSupabase() {
  const { supabaseUrl, supabaseAnonKey } = getConfig();
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase credentials not configured');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
}

import { createClient } from '@supabase/supabase-js';
import { DbSource, DbArticle, DbDailyReport } from './types';

/**
 * Supabase 数据库操作
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ============ Sources (信息源) ============

export async function getSources(): Promise<DbSource[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('*')
    .eq('enabled', true);

  if (error) throw error;
  return data || [];
}

export async function addSource(source: Omit<DbSource, 'id' | 'createdAt' | 'updatedAt'>): Promise<DbSource> {
  const { data, error } = await supabase
    .from('sources')
    .insert([
      {
        ...source,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSource(id: string, updates: Partial<DbSource>): Promise<DbSource> {
  const { data, error } = await supabase
    .from('sources')
    .update({
      ...updates,
      updated_at: new Date(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============ Articles (文章) ============

export async function getArticles(
  startDate?: Date,
  endDate?: Date
): Promise<DbArticle[]> {
  let query = supabase.from('articles').select('*');

  if (startDate) {
    query = query.gte('pub_date', startDate.toISOString());
  }
  if (endDate) {
    query = query.lte('pub_date', endDate.toISOString());
  }

  const { data, error } = await query.order('pub_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addArticle(article: Omit<DbArticle, 'id' | 'fetchedAt'>): Promise<DbArticle> {
  const { data, error } = await supabase
    .from('articles')
    .insert([
      {
        ...article,
        fetched_at: new Date(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addArticles(
  articles: Omit<DbArticle, 'id' | 'fetchedAt'>[]
): Promise<DbArticle[]> {
  const { data, error } = await supabase
    .from('articles')
    .insert(
      articles.map((a) => ({
        ...a,
        fetched_at: new Date(),
      }))
    )
    .select();

  if (error) throw error;
  return data || [];
}

export async function isDuplicateArticle(link: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .eq('link', link)
    .limit(1);

  if (error) throw error;
  return (data?.length || 0) > 0;
}

// ============ Daily Reports (日报) ============

export async function getDailyReport(date: Date): Promise<DbDailyReport | null> {
  const dateStr = date.toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_reports')
    .select('*')
    .eq('date', dateStr)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }
  return data || null;
}

export async function createDailyReport(
  date: Date,
  selectedArticles: string[]
): Promise<DbDailyReport> {
  const dateStr = date.toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('daily_reports')
    .insert([
      {
        date: dateStr,
        selected_articles: selectedArticles,
        status: 'draft',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDailyReport(
  id: string,
  updates: Partial<DbDailyReport>
): Promise<DbDailyReport> {
  const { data, error } = await supabase
    .from('daily_reports')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function publishDailyReport(id: string): Promise<DbDailyReport> {
  return updateDailyReport(id, {
    status: 'published',
    publishedAt: new Date(),
  });
}

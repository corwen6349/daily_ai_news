import { nanoid } from 'nanoid';
import { defaultSources, getConfig } from '@daily-ai-news/config';
import { getSupabase } from './supabase';
import { Article, Report, Source } from './types';

interface MemoryStore {
  sources: Source[];
  articles: Article[];
  reports: Report[];
}

declare global {
  // eslint-disable-next-line no-var
  var __dailyAiNewsStore: MemoryStore | undefined;
}

function getMemoryStore(): MemoryStore {
  if (!globalThis.__dailyAiNewsStore) {
    globalThis.__dailyAiNewsStore = {
      sources: defaultSources.map((source) => ({ 
        ...source, 
        id: nanoid(), 
        created_at: new Date().toISOString() 
      })),
      articles: [],
      reports: []
    };
  }
  return globalThis.__dailyAiNewsStore;
}

function supabaseAvailable() {
  const { supabaseUrl, supabaseAnonKey } = getConfig();
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function listSources(): Promise<Source[]> {
  if (!supabaseAvailable()) {
    return getMemoryStore().sources;
  }

  const { data, error } = await getSupabase()
    .from('sources')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  return (data ?? []) as Source[];
}

export async function createSource(input: Omit<Source, 'id' | 'created_at'>): Promise<Source> {
  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    const source: Source = {
      ...input,
      id: nanoid(),
      created_at: new Date().toISOString()
    };
    store.sources.unshift(source);
    return source;
  }

  const { data, error } = await getSupabase()
    .from('sources')
    .insert({
      name: input.name,
      url: input.url,
      category: input.category
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Source;
}

export async function updateSource(id: string, input: Partial<Omit<Source, 'id' | 'created_at'>>): Promise<Source> {
  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    const index = store.sources.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Source not found');
    }
    store.sources[index] = { ...store.sources[index], ...input };
    return store.sources[index];
  }

  const { data, error } = await getSupabase()
    .from('sources')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Source;
}

export async function deleteSource(id: string): Promise<void> {
  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    store.sources = store.sources.filter(s => s.id !== id);
    return;
  }

  const { error } = await getSupabase()
    .from('sources')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
}

export async function listArticles({
  limit = 20,
  offset = 0,
  sourceId
}: {
  limit?: number;
  offset?: number;
  sourceId?: string;
} = {}): Promise<Article[]> {
  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    const articles = sourceId
      ? store.articles.filter((article) => article.source_id === sourceId)
      : store.articles;
    return articles.slice(offset, offset + limit);
  }

  let query = getSupabase()
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (sourceId) {
    query = query.eq('source_id', sourceId);
  }
  
  const { data, error } = await query as any;
  
  if (error) {
    throw error;
  }
  return data ?? [];
}

export async function storeArticles(articles: Article[]): Promise<{ inserted: number; updated: number }> {
  if (!articles.length) {
    return { inserted: 0, updated: 0 };
  }

  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    let inserted = 0;
    let updated = 0;
    
    for (const article of articles) {
      const existingIndex = store.articles.findIndex((item) => item.url === article.url);
      if (existingIndex >= 0) {
        store.articles[existingIndex] = { ...store.articles[existingIndex], ...article };
        updated += 1;
      } else {
        store.articles.unshift({ 
          ...article, 
          id: article.id ?? nanoid(), 
          created_at: new Date().toISOString() 
        });
        inserted += 1;
      }
    }
    return { inserted, updated };
  }

  const { error } = await getSupabase()
    .from('articles')
    .upsert(articles, {
      onConflict: 'url',
      ignoreDuplicates: false
    });
    
  if (error) {
    throw error;
  }
  return { inserted: articles.length, updated: 0 };
}

export async function getArticlesByIds(ids: string[]): Promise<Article[]> {
  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    return store.articles.filter((article) => ids.includes(article.id));
  }

  const { data, error } = await getSupabase()
    .from('articles')
    .select('*')
    .in('id', ids);
    
  if (error) {
    throw error;
  }
  return (data ?? []) as Article[];
}

export async function listReports(): Promise<Report[]> {
  if (!supabaseAvailable()) {
    return getMemoryStore().reports;
  }

  const { data, error } = await getSupabase()
    .from('reports')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }
  return (data ?? []) as Report[];
}

export async function saveReport({
  date,
  html,
  publishedUrl,
  articleIds
}: {
  date: string;
  html: string;
  publishedUrl?: string;
  articleIds: string[];
}): Promise<Report> {
  if (!supabaseAvailable()) {
    const store = getMemoryStore();
    const report: Report = {
      id: nanoid(),
      date,
      html,
      published_url: publishedUrl,
      article_ids: articleIds,
      created_at: new Date().toISOString()
    };
    store.reports.unshift(report);
    return report;
  }

  const { data, error } = await getSupabase()
    .from('reports')
    .insert({
      date,
      html,
      published_url: publishedUrl,
      article_ids: articleIds
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data as Report;
}

export type { Source, Article, Report } from './types';

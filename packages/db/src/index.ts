import { nanoid } from 'nanoid';
import { defaultSources, getConfig } from '@daily-ai-news/config';
import { getSupabase, hasSupabaseConfig } from './supabase';
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

export async function listSources(): Promise<Source[]> {
  if (!hasSupabaseConfig()) {
    console.log('Using memory store for sources');
    return getMemoryStore().sources;
  }

  try {
    const { data, error } = await getSupabase()
      .from('sources')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error, falling back to memory store:', error);
      return getMemoryStore().sources;
    }
    return (data ?? []) as Source[];
  } catch (error) {
    console.error('Error accessing Supabase, using memory store:', error);
    return getMemoryStore().sources;
  }
}

export async function createSource(input: Omit<Source, 'id' | 'created_at'>): Promise<Source> {
  if (!hasSupabaseConfig()) {
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
  if (!hasSupabaseConfig()) {
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
  if (!hasSupabaseConfig()) {
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
  if (!hasSupabaseConfig()) {
    const store = getMemoryStore();
    const articles = sourceId
      ? store.articles.filter((article) => article.source_id === sourceId)
      : store.articles;
    return articles.slice(offset, offset + limit);
  }

  let query = getSupabase()
    .from('articles')
    .select('*, link:url, pub_date:published_at')
    .order('pub_date', { ascending: false })
    .range(offset, offset + limit - 1);
    
  if (sourceId) {
    query = query.eq('source_id', sourceId);
  }
  
  const { data, error } = await query as any;
  
  if (error) {
    console.error('Supabase error fetching articles:', error);
    throw error;
  }
  
  // 将数据库字段映射到代码字段
  return (data ?? []).map((item: any) => ({
    id: item.id,
    source_id: item.source_id,
    title: item.title,
    url: item.link,
    summary: item.summary,
    content: item.content,
    published_at: item.pub_date,
    created_at: item.created_at
  }));
}

export async function storeArticles(articles: Article[]): Promise<{ inserted: number; updated: number }> {
  if (!articles.length) {
    return { inserted: 0, updated: 0 };
  }

  if (!hasSupabaseConfig()) {
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

  // 将代码字段映射到数据库字段
  const dbArticles = articles.map(article => ({
    id: article.id,
    source_id: article.source_id,
    title: article.title,
    link: article.url,  // url -> link
    summary: article.summary,
    content: article.content,
    pub_date: article.published_at,  // published_at -> pub_date
    created_at: article.created_at
  }));

  const { error } = await getSupabase()
    .from('articles')
    .upsert(dbArticles, {
      onConflict: 'link',  // 注意这里改为 link
      ignoreDuplicates: false
    });
    
  if (error) {
    console.error('Supabase error storing articles:', error);
    throw error;
  }
  return { inserted: articles.length, updated: 0 };
}

export async function getArticlesByIds(ids: string[]): Promise<Article[]> {
  if (!hasSupabaseConfig()) {
    const store = getMemoryStore();
    return store.articles.filter((article) => ids.includes(article.id));
  }

  const { data, error } = await getSupabase()
    .from('articles')
    .select('*')
    .in('id', ids);
    
  if (error) {
    console.error('Supabase error getting articles by ids:', error);
    throw error;
  }
  
  // 将数据库字段映射到代码字段
  return (data ?? []).map((item: any) => ({
    id: item.id,
    source_id: item.source_id,
    title: item.title,
    url: item.link,
    summary: item.summary,
    content: item.content,
    published_at: item.pub_date,
    created_at: item.created_at
  }));
}

export async function listReports(): Promise<Report[]> {
  if (!hasSupabaseConfig()) {
    return getMemoryStore().reports;
  }

  const { data, error } = await getSupabase()
    .from('reports')
    .select('*')
    .order('report_date', { ascending: false });

  if (error) {
    console.error('Supabase error fetching reports:', error);
    throw error;
  }
  
  // 将数据库字段映射到代码字段
  return (data ?? []).map((item: any) => ({
    id: item.id,
    date: item.report_date,
    html: item.html_content,
    published_url: item.publish_url,
    article_ids: item.article_ids || [],
    created_at: item.created_at
  }));
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
  if (!hasSupabaseConfig()) {
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
      title: `AI Daily News - ${date}`,  // 添加 title 字段
      content: html,  // content 字段
      html_content: html,  // html_content 字段
      publish_url: publishedUrl,  // 注意下划线
      report_date: date,  // date -> report_date
      article_ids: articleIds
    })
    .select()
    .single();

  if (error) {
    console.error('Supabase error saving report:', error);
    throw error;
  }
  
  // 将数据库字段映射回代码字段
  return {
    id: data.id,
    date: data.report_date,
    html: data.html_content,
    published_url: data.publish_url,
    article_ids: data.article_ids || [],
    created_at: data.created_at
  } as Report;
}

export type { Source, Article, Report } from './types';

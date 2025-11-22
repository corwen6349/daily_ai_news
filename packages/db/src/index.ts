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

// 辅助函数：处理 Supabase 错误，避免循环引用
function handleSupabaseError(error: any, context: string): Error {
  const errorInfo = {
    message: error.message || 'Unknown error',
    code: error.code,
    details: error.details,
    hint: error.hint
  };
  console.error(`Supabase error in ${context}:`, errorInfo);
  return new Error(`${context}: ${errorInfo.message} (${errorInfo.code || 'unknown'})`);
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
    throw handleSupabaseError(error, 'createSource');
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
    throw handleSupabaseError(error, 'updateSource');
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
    throw handleSupabaseError(error, 'deleteSource');
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

  try {
    let query = getSupabase()
      .from('articles')
      .select('*')
      .order('pub_date', { ascending: false })
      .range(offset, offset + limit - 1);
      
    if (sourceId) {
      query = query.eq('source_id', sourceId);
    }
    
    const { data, error } = await query as any;
    
    if (error) {
      throw handleSupabaseError(error, 'listArticles');
    }
    
    // 将数据库字段映射到代码字段
    return (data ?? []).map((item: any) => ({
      id: item.id,
      source_id: item.source_id,
      title: item.title,
      url: item.link,
      summary: item.summary,
      content: item.content,
      images: item.images || [], // Map images
      videos: item.videos || [], // Map videos
      published_at: item.pub_date,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error in listArticles, falling back to memory store:', error);
    return getMemoryStore().articles.slice(offset, offset + limit);
  }
}

// 删除超过24小时的文章（在抓取后清理）
export async function deleteOldArticles(): Promise<number> {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  
  if (!hasSupabaseConfig()) {
    const store = getMemoryStore();
    const beforeCount = store.articles.length;
    store.articles = store.articles.filter(article => {
      if (!article.published_at) return false;
      return article.published_at >= twentyFourHoursAgo;
    });
    const deleted = beforeCount - store.articles.length;
    console.log(`🗑️  删除了 ${deleted} 条过期数据`);
    return deleted;
  }

  try {
    // Delete articles older than 24 hours
    const { count: countOld, error: errorOld } = await getSupabase()
      .from('articles')
      .delete({ count: 'exact' })
      .lt('pub_date', twentyFourHoursAgo);
      
    if (errorOld) throw handleSupabaseError(errorOld, 'deleteOldArticles');
    
    const totalDeleted = countOld || 0;
    console.log(`🗑️  删除了 ${totalDeleted} 条过期数据`);
    return totalDeleted;
  } catch (error) {
    console.error('删除过期文章失败:', error);
    return 0;
  }
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

  // 去重：按照 URL 去重，保留最后一条（通常是最新的）
  const uniqueArticles = Array.from(
    new Map(articles.map(article => [article.url, article])).values()
  );
  
  const duplicatesRemoved = articles.length - uniqueArticles.length;
  if (duplicatesRemoved > 0) {
    console.log(`⚠️  去除了 ${duplicatesRemoved} 条重复的文章（相同URL）`);
  }

  // 将代码字段映射到数据库字段
  // 注意：不包含 id 字段，让 Supabase 自动生成 UUID
  const dbArticles = uniqueArticles.map(article => ({
    source_id: article.source_id,
    title: article.title,
    link: article.url,  // url -> link
    summary: article.summary,
    content: article.content,
    images: article.images, // Map images
    videos: article.videos, // Map videos
    pub_date: article.published_at,  // published_at -> pub_date
  }));

  try {
    const { error } = await getSupabase()
      .from('articles')
      .upsert(dbArticles, {
        onConflict: 'link',
        ignoreDuplicates: false
      });
      
    if (error) {
      throw handleSupabaseError(error, 'storeArticles');
    }
    return { inserted: uniqueArticles.length, updated: 0 };
  } catch (error) {
    // 如果是我们抛出的错误，直接传递
    if (error instanceof Error) {
      throw error;
    }
    // 否则创建新的错误
    throw new Error(`Failed to store articles: ${String(error)}`);
  }
}

export async function getArticlesByIds(ids: string[]): Promise<Article[]> {
  if (!hasSupabaseConfig()) {
    const store = getMemoryStore();
    return store.articles.filter((article) => article.id && ids.includes(article.id));
  }

  try {
    const { data, error } = await getSupabase()
      .from('articles')
      .select('*')
      .in('id', ids);
      
    if (error) {
      throw handleSupabaseError(error, 'getArticlesByIds');
    }
    
    // 将数据库字段映射到代码字段
    return (data ?? []).map((item: any) => ({
      id: item.id,
      source_id: item.source_id,
      title: item.title,
      url: item.link,
      summary: item.summary,
      content: item.content,
      images: item.images || [], // Map images
      videos: item.videos || [], // Map videos
      published_at: item.pub_date,
      created_at: item.created_at
    }));
  } catch (error) {
    console.error('Error in getArticlesByIds, falling back to memory store:', error);
    return getMemoryStore().articles.filter((article) => article.id && ids.includes(article.id));
  }
}

export async function listReports(): Promise<Report[]> {
  if (!hasSupabaseConfig()) {
    return getMemoryStore().reports;
  }

  try {
    const { data, error } = await getSupabase()
      .from('reports')
      .select('*')
      .order('report_date', { ascending: false });

    if (error) {
      throw handleSupabaseError(error, 'listReports');
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
  } catch (error) {
    console.error('Error in listReports, falling back to memory store:', error);
    return getMemoryStore().reports;
  }
}

export async function saveReport({
  date,
  html,
  publishedUrl,
  articleIds,
}: {
  date: string;
  html: string;
  publishedUrl?: string;
  articleIds: string[];
}): Promise<Report> {
  if (!hasSupabaseConfig()) {
    const store = getMemoryStore();
    // Check if report for this date already exists
    const existingIndex = store.reports.findIndex(r => r.date === date);
    
    const report: Report = {
      id: existingIndex >= 0 ? store.reports[existingIndex].id : nanoid(),
      date,
      html,
      published_url: publishedUrl,
      article_ids: articleIds,
      created_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      store.reports[existingIndex] = report;
      console.log(`📝 更新了内存中的报告: ${date}`);
    } else {
      store.reports.unshift(report);
      console.log(`📝 保存了新报告到内存: ${date}`);
    }
    return report;
  }

  // Delete existing report for this date to ensure uniqueness (overwrite)
  const { error: deleteError } = await getSupabase()
    .from('reports')
    .delete()
    .eq('report_date', date);
    
  if (deleteError) {
    console.warn('清理旧报告失败 (非致命):', deleteError);
  }

  const { data, error } = await getSupabase()
    .from('reports')
    .insert({
      title: `AI Daily News - ${date}`,
      content: html,
      html_content: html,
      publish_url: publishedUrl,
      report_date: date,
      article_ids: articleIds,
    })
    .select()
    .single();

  if (error) {
    // 如果错误是关于 article_ids 字段不存在，尝试不包含该字段
    if (error.code === 'PGRST204' && error.message?.includes('article_ids')) {
      console.warn('⚠️  reports 表缺少 article_ids 字段，尝试不包含该字段保存...');
      console.warn('提示：在 Supabase SQL Editor 中执行: ALTER TABLE reports ADD COLUMN article_ids TEXT[] DEFAULT \'{}\';');
      
      // 移除 article_ids 字段重试
      const retryResult = await getSupabase()
        .from('reports')
        .insert({
          title: `AI Daily News - ${date}`,
          content: html,
          html_content: html,
          publish_url: publishedUrl,
          report_date: date
        })
        .select()
        .single();
      
      if (retryResult.error) {
        throw handleSupabaseError(retryResult.error, 'saveReport');
      }
      
      // 返回结果，article_ids 为空数组
      return {
        id: retryResult.data.id,
        date: retryResult.data.report_date,
        html: retryResult.data.html_content,
        published_url: retryResult.data.publish_url,
        article_ids: [],
        created_at: retryResult.data.created_at
      } as Report;
    }
    
    throw handleSupabaseError(error, 'saveReport');
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

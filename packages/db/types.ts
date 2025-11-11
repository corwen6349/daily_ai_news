/**
 * 数据库类型定义
 */

export interface DbSource {
  id: string;
  url: string;
  name: string;
  category: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DbArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  sourceId: string;
  sourceName: string;
  pubDate: Date;
  fetchedAt: Date;
  content?: string;
  author?: string;
}

export interface DbDailyReport {
  id: string;
  date: Date;
  selectedArticles: string[]; // article IDs
  summary?: string;
  generatedHtml?: string;
  publishedAt?: Date;
  status: 'draft' | 'published' | 'archived';
}

export interface DbUser {
  id: string;
  email: string;
  password?: string; // 可选，如果使用 OAuth
  role: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
}

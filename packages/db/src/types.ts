export interface Source {
  id: string;
  name: string;
  url: string;
  category?: string;
  created_at?: string;
}

export interface Article {
  id?: string;  // 可选，让 Supabase 自动生成 UUID
  source_id: string;
  title: string;
  url: string;
  summary?: string;
  content?: string;
  published_at?: string;
  created_at?: string;
}

export interface Report {
  id: string;
  date: string;
  html: string;
  published_url?: string;
  github_url?: string;
  article_ids: string[];
  created_at?: string;
}

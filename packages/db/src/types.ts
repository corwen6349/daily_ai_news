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
  images?: string[];  // 图片 URL 数组
  videos?: string[];  // 视频 URL 数组
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
  video_script?: string;  // 视频口播稿
  video_script_title?: string; // 视频口播稿标题
  created_at?: string;
}

import type { Source } from '@daily-ai-news/db';

export interface Config {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  geminiApiKey?: string;
  deepseekApiKey?: string;
  githubToken?: string;
  githubRepo?: string;
  githubBranch?: string;
}

export function getConfig(): Config {
  return {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    geminiApiKey: process.env.GEMINI_API_KEY,
    deepseekApiKey: process.env.DEEPSEEK_API_KEY,
    githubToken: process.env.GITHUB_TOKEN,
    githubRepo: process.env.GITHUB_REPO,
    githubBranch: process.env.GITHUB_BRANCH || 'main',
  };
}

export const defaultSources: Omit<Source, 'id' | 'created_at'>[] = [
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'AI Research'
  },
  {
    name: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    category: 'AI Tools'
  },
  {
    name: 'AI News (MIT Technology Review)',
    url: 'https://www.technologyreview.com/feed/',
    category: 'AI News'
  },
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    category: 'AI News'
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    category: 'AI News'
  }
];

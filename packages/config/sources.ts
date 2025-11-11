/**
 * 推荐的 AI 新闻源列表
 * 可以直接复制这些 RSS 源到应用中
 */

export const RECOMMENDED_SOURCES = [
  // 主流科技媒体
  {
    name: 'Hacker News (AI)',
    url: 'https://news.ycombinator.com/rss',
    category: 'tech',
    description: '最新的科技和 AI 新闻',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'tech',
    description: '科技产品和新闻',
  },
  {
    name: 'ArsTechnica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'tech',
    description: '深度技术文章',
  },
  
  // AI 专业站点
  {
    name: 'Papers with Code',
    url: 'https://feeds.paperswithcode.com/latest',
    category: 'ai_research',
    description: 'AI 论文和代码',
  },
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog/rss.xml',
    category: 'ai_official',
    description: 'OpenAI 官方博客',
  },
  {
    name: 'DeepMind Blog',
    url: 'https://deepmind.google/blog/feed/rss.xml',
    category: 'ai_official',
    description: 'DeepMind 官方博客',
  },
  
  // 中文科技媒体
  {
    name: '36氪 (AI)',
    url: 'https://36kr.com/feed',
    category: 'chinese_tech',
    description: '中文科技新闻',
  },
  {
    name: '澎湃新闻 (科技)',
    url: 'https://www.thepaper.cn/rss_tech.xml',
    category: 'chinese_tech',
    description: '澎湃新闻科技频道',
  },
  
  // 研究和学术
  {
    name: 'arXiv (AI)',
    url: 'http://arxiv.org/rss/cs.AI',
    category: 'research',
    description: '最新 AI 论文预印本',
  },
  {
    name: 'arXiv (ML)',
    url: 'http://arxiv.org/rss/stat.ML',
    category: 'research',
    description: '机器学习论文',
  },
  {
    name: 'Nature Machine Intelligence',
    url: 'https://www.nature.com/articles/search?q=artificial%20intelligence&journal=natmachintell',
    category: 'research',
    description: '自然机器智能期刊',
  },
  
  // 行业新闻
  {
    name: 'VentureBeat (AI)',
    url: 'https://venturebeat.com/feed/',
    category: 'industry',
    description: '创投和行业新闻',
  },
  {
    name: 'TechCrunch (AI)',
    url: 'https://techcrunch.com/feed/',
    category: 'industry',
    description: 'TechCrunch 新闻',
  },
];

// 按分类分组
export const SOURCES_BY_CATEGORY = {
  tech: RECOMMENDED_SOURCES.filter((s) => s.category === 'tech'),
  ai_official: RECOMMENDED_SOURCES.filter((s) => s.category === 'ai_official'),
  ai_research: RECOMMENDED_SOURCES.filter((s) => s.category === 'ai_research'),
  chinese_tech: RECOMMENDED_SOURCES.filter((s) => s.category === 'chinese_tech'),
  research: RECOMMENDED_SOURCES.filter((s) => s.category === 'research'),
  industry: RECOMMENDED_SOURCES.filter((s) => s.category === 'industry'),
};

// 快速导入脚本
export async function importRecommendedSources() {
  const results = [];
  
  for (const source of RECOMMENDED_SOURCES) {
    try {
      const res = await fetch('/api/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: source.name,
          url: source.url,
          category: source.category,
        }),
      });
      
      if (res.ok) {
        results.push({ source: source.name, status: 'success' });
      } else {
        results.push({ source: source.name, status: 'failed', error: await res.text() });
      }
    } catch (error) {
      results.push({ source: source.name, status: 'error', error });
    }
  }
  
  return results;
}

export default RECOMMENDED_SOURCES;

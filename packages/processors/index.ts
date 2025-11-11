/**
 * 数据处理器 - 去重、过滤、排序
 */

export interface Article {
  id?: string;
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  source: string;
  sourceId: string;
  content?: string;
}

/**
 * 去重处理
 */
export function deduplicateArticles(articles: Article[]): Article[] {
  const seen = new Set<string>();
  const result: Article[] = [];

  for (const article of articles) {
    // 使用标题和链接组合作为唯一标识
    const key = `${article.title}|${article.link}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(article);
    }
  }

  return result;
}

/**
 * 过滤处理 - 移除非 AI 相关内容
 */
export function filterAIArticles(articles: Article[]): Article[] {
  const aiKeywords = [
    'AI',
    'GPT',
    '人工智能',
    'LLM',
    'transformer',
    '机器学习',
    'deep learning',
    'neural network',
    '深度学习',
    'ChatGPT',
    'Claude',
    'Gemini',
    'DeepSeek',
    'Llama',
    'mistral',
    'neural',
    'model',
    '模型',
    'algorithm',
    '算法',
  ];

  return articles.filter((article) => {
    const text = `${article.title} ${article.description}`.toLowerCase();
    return aiKeywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });
}

/**
 * 排序处理 - 按发布时间倒序
 */
export function sortByDate(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());
}

/**
 * 质量打分
 */
export function scoreArticle(article: Article): number {
  let score = 0;

  // 标题质量
  if (article.title.length > 10 && article.title.length < 100) {
    score += 2;
  }

  // 描述质量
  if (article.description && article.description.length > 50) {
    score += 2;
  }

  // 内容质量
  if (article.content && article.content.length > 200) {
    score += 3;
  }

  // 来源权威性
  const authorityBoost: { [key: string]: number } = {
    'Hacker News': 2,
    'MIT': 2,
    'OpenAI': 2,
    'Google': 1,
    'Twitter': -1,
  };

  for (const [source, boost] of Object.entries(authorityBoost)) {
    if (article.source.includes(source)) {
      score += boost;
    }
  }

  return Math.max(0, score);
}

/**
 * 推荐处理 - 根据评分选择top文章
 */
export function recommendArticles(articles: Article[], count: number = 10): Article[] {
  const scored = articles.map((article) => ({
    article,
    score: scoreArticle(article),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map((item) => item.article);
}

/**
 * 管道处理
 */
export function processArticles(
  articles: Article[],
  options: {
    deduplicate?: boolean;
    filter?: boolean;
    sort?: boolean;
    recommend?: boolean;
    count?: number;
  } = {}
): Article[] {
  const {
    deduplicate = true,
    filter = true,
    sort = true,
    recommend = true,
    count = 10,
  } = options;

  let processed = [...articles];

  if (deduplicate) {
    processed = deduplicateArticles(processed);
  }

  if (filter) {
    processed = filterAIArticles(processed);
  }

  if (sort) {
    processed = sortByDate(processed);
  }

  if (recommend) {
    processed = recommendArticles(processed, count);
  }

  return processed;
}

/**
 * RSS 数据采集器
 */

export interface RSSSource {
  id: string;
  url: string;
  name: string;
  category: string;
  enabled: boolean;
  createdAt: Date;
}

export interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  author?: string;
  source: string;
  sourceId: string;
  content?: string;
}

export async function fetchRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; DailyAINews/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const items = parseRSS(text);
    return items;
  } catch (error) {
    console.error(`Failed to fetch RSS from ${url}:`, error);
    return [];
  }
}

function parseRSS(xml: string): RSSItem[] {
  const items: RSSItem[] = [];
  
  // 简单的 XML 解析 (生产环境应使用专业库如 fast-xml-parser)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const description = extractTag(itemXml, 'description');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const author = extractTag(itemXml, 'author');

    if (title && link) {
      items.push({
        title,
        description: description || '',
        link,
        pubDate: new Date(pubDate || new Date()),
        author: author || 'Unknown',
        source: extractTag(xml, 'title') || 'RSS Feed',
        sourceId: 'rss-feed',
        content: description,
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  if (match && match[1]) {
    return decodeHTMLEntities(match[1])
      .replace(/<[^>]*>/g, '') // 移除 HTML 标签
      .trim();
  }
  return '';
}

function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
  };

  return text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] || entity);
}

export async function fetchMultipleRSSFeeds(
  sources: RSSSource[]
): Promise<RSSItem[]> {
  const results = await Promise.all(
    sources
      .filter((s) => s.enabled)
      .map((source) =>
        fetchRSSFeed(source.url).then((items) =>
          items.map((item) => ({
            ...item,
            sourceId: source.id,
            source: source.name,
          }))
        )
      )
  );

  return results.flat();
}

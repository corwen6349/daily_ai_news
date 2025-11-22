
import { Article, Source } from '@daily-ai-news/db';
import * as cheerio from 'cheerio';

export async function fetchFolo(sources: Source[]): Promise<Article[]> {
  if (!sources || sources.length === 0) {
    return [];
  }

  console.log(`Fetching Folo feeds for ${sources.length} sources...`);
  const allArticles: Article[] = [];

  for (const source of sources) {
    try {
      const articles = await fetchFoloFeed(source);
      allArticles.push(...articles);
    } catch (error) {
      console.error(`Failed to fetch Folo feed for ${source.name}:`, error);
    }
  }

  return allArticles;
}

async function fetchFoloFeed(source: Source): Promise<Article[]> {
  let fetchUrl = source.url;

  // Handle timeline URLs by converting them to share URLs
  // Example: https://app.folo.is/timeline/articles/56446234310693888/pending
  const timelineMatch = source.url.match(/app\.folo\.is\/timeline\/articles\/(\d+)/);
  if (timelineMatch && timelineMatch[1]) {
    fetchUrl = `https://app.folo.is/share/feeds/${timelineMatch[1]}`;
    console.log(`Converted timeline URL to share URL: ${fetchUrl}`);
  }

  console.log(`Fetching Folo from: ${fetchUrl}`);

  const response = await fetch(fetchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${fetchUrl}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  
  let jsonData: any = null;

  // Find the script containing window.__HYDRATE__
  $('script').each((i, el) => {
    const content = $(el).html();
    if (content && content.includes('window.__HYDRATE__')) {
      // Extract the JSON string
      // Format is usually: window.__HYDRATE__=window.__HYDRATE__||{},window.__HYDRATE__["key"]=JSON.parse('...');
      
      // We need to find the JSON.parse('...') part
      const match = content.match(/JSON\.parse\('(.+)'\)/);
      if (match && match[1]) {
        try {
            // The string inside JSON.parse is often escaped (e.g. \' for '), so we might need to unescape it first if it was a raw string literal in JS
            // But JSON.parse expects a string. The regex captures the content inside the quotes.
            // However, the content itself might contain escaped characters like \\" for " inside the JSON string.
            // Let's try to parse it directly.
            // Wait, the regex match[1] will be the raw string passed to JSON.parse.
            // If the source is `JSON.parse('{"a":1}')`, match[1] is `{"a":1}`.
            // If the source is `JSON.parse('{"a":"b\'c"}')`, match[1] is `{"a":"b\'c"}`.
            // We might need to handle JS string unescaping before JSON parsing.
            // A safer way is to execute the code or use a more robust parser, but for now let's try simple JSON.parse.
            // Actually, the output I saw earlier was: JSON.parse('{"feed":...}')
            // So match[1] should be the JSON string.
            
            // There is a catch: The string inside JSON.parse might have escaped single quotes if it's wrapped in single quotes.
            // And backslashes might be double escaped.
            // Let's try a simple approach first.
            
            // The captured group might contain escaped characters that were escaped for the JS string literal.
            // e.g. \\" -> \"
            // We can use a simple unescape function.
            const unescaped = match[1]
                .replace(/\\'/g, "'")
                .replace(/\\\\/g, "\\");
                
            jsonData = JSON.parse(unescaped);
            return false; // break loop
        } catch (e) {
            console.warn('Failed to parse JSON from script:', e);
            // Try parsing without unescaping if that failed, or maybe the regex was too greedy/not greedy enough.
            try {
                jsonData = JSON.parse(match[1]);
                return false;
            } catch (e2) {
                 // ignore
            }
        }
      }
    }
  });

  if (!jsonData || !jsonData.entries) {
    console.warn(`No entries found in Folo feed: ${source.url}`);
    return [];
  }

  const articles: Article[] = [];
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  for (const entry of jsonData.entries) {
    if (!entry.publishedAt) continue;
    
    const pubDate = new Date(entry.publishedAt);
    if (pubDate > twentyFourHoursAgo) {
      articles.push({
        source_id: source.id,
        title: entry.title || 'No Title',
        url: entry.url || source.url,
        content: entry.content || entry.description || '',
        published_at: pubDate.toISOString(),
        // Folo entries often have images in 'media' array
        images: entry.media ? entry.media.map((m: any) => m.url).slice(0, 5) : undefined
      });
    }
  }

  console.log(`Found ${articles.length} recent articles from Folo.`);
  return articles;
}

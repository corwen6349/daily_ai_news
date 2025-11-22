import { Article, Source } from '@daily-ai-news/db';
import Parser from 'rss-parser';

// Initialize RSS parser with timeout and headers
const parser = new Parser({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  }
});

/**
 * Fetches recent tweets for a list of sources from Nitter.
 * @param sources List of sources to fetch tweets from.
 * @returns A promise that resolves to an array of articles.
 */
export async function fetchTweets(sources: Source[]): Promise<Article[]> {
  if (!sources || sources.length === 0) {
    console.log('No Twitter sources configured, skipping tweet fetch.');
    return [];
  }

  console.log(`Fetching tweets for ${sources.length} sources...`);
  const allTweets: Article[] = [];

  for (const source of sources) {
    try {
      // Extract username and base URL from source URL
      const urlObj = new URL(source.url);
      // Remove leading slash and potential trailing slash
      const author = urlObj.pathname.replace(/^\/|\/$/g, '');
      const baseUrl = urlObj.origin;
      
      if (!author) {
        console.warn(`Invalid Twitter source URL: ${source.url}`);
        continue;
      }

      const tweets = await fetchTweetsForAuthor(author, source.id, baseUrl);
      allTweets.push(...tweets);
    } catch (error) {
      console.error(`Failed to fetch tweets for ${source.name}:`, error);
    }
  }

  return allTweets;
}

async function fetchTweetsForAuthor(author: string, sourceId: string, baseUrl: string): Promise<Article[]> {
  // Use RSS feed instead of HTML scraping
  const rssUrl = `${baseUrl}/${author}/rss`;
  console.log(`Fetching RSS from: ${rssUrl}`);

  try {
    const feed = await parser.parseURL(rssUrl);
    const articles: Article[] = [];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    if (!feed.items) {
      return [];
    }

    for (const item of feed.items) {
      // Skip if no date or content
      if (!item.isoDate || !item.content) continue;

      const tweetDate = new Date(item.isoDate);

      // Check if within last 24 hours
      if (tweetDate > twentyFourHoursAgo) {
        // Nitter RSS titles are usually the tweet content
        const title = item.title || `${author} on X`;
        
        articles.push({
          source_id: sourceId,
          title: `${author}: ${title.substring(0, 50)}...`,
          url: item.link || '',
          content: item.contentSnippet || item.content || '',
          published_at: tweetDate.toISOString(),
        });
      }
    }

    console.log(`Found ${articles.length} recent tweets for ${author} via RSS.`);
    return articles.slice(0, 10);

  } catch (error: any) {
    throw new Error(`Failed to fetch RSS ${rssUrl}: ${error.message}`);
  }
}

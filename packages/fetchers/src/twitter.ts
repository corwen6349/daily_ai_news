import { Article } from '@daily-ai-news/db';
import { getConfig } from '@daily-ai-news/config';
import * as cheerio from 'cheerio';

const NITTER_INSTANCE = 'https://nitter.net';

/**
 * Fetches recent tweets for a list of authors from Nitter.
 * @returns A promise that resolves to an array of articles.
 */
export async function fetchTweets(): Promise<Article[]> {
  const { twitterAuthors } = getConfig();
  if (!twitterAuthors || twitterAuthors.length === 0) {
    console.log('No Twitter authors configured, skipping tweet fetch.');
    return [];
  }

  console.log(`Fetching tweets for: ${twitterAuthors.join(', ')}`);
  const allTweets: Article[] = [];

  for (const author of twitterAuthors) {
    try {
      const tweets = await fetchTweetsForAuthor(author);
      allTweets.push(...tweets);
    } catch (error) {
      console.error(`Failed to fetch tweets for ${author}:`, error);
    }
  }

  return allTweets;
}

async function fetchTweetsForAuthor(author: string): Promise<Article[]> {
  const url = `${NITTER_INSTANCE}/${author}`;
  console.log(`Fetching from: ${url}`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const articles: Article[] = [];
  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  $('.timeline-item').each((i, el) => {
    const tweet = $(el);

    // Skip retweets and replies
    const isRetweet = tweet.find('.retweet-header').length > 0;
    const isReply = tweet.find('.replying-to').length > 0;
    if (isRetweet || isReply) {
      return;
    }

    const tweetLink = tweet.find('a.tweet-link')?.attr('href');
    const tweetUrl = `${NITTER_INSTANCE}${tweetLink}`;
    const tweetContent = tweet.find('.tweet-content').text().trim();
    const tweetDateStr = tweet.find('.tweet-date a').attr('title');

    if (!tweetDateStr || !tweetContent || !tweetUrl) {
      return;
    }

    // Example date format: "Nov 19, 2025 · 10:00 AM UTC"
    const tweetDate = new Date(tweetDateStr.replace('·', '').trim());

    if (tweetDate > twelveHoursAgo) {
      articles.push({
        source_id: `twitter:${author}`,
        title: `${author} on X: "${tweetContent.substring(0, 50)}..."`,
        url: tweetUrl,
        content: tweetContent,
        published_at: tweetDate.toISOString(),
      });
    }
  });

  console.log(`Found ${articles.length} recent original tweets for ${author}.`);
  return articles.slice(0, 10); // Limit to 10 per author for now
}

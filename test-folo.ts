
import * as cheerio from 'cheerio';

async function testFolo() {
  const url = 'https://app.folo.is/share/feeds/100411504863520768?view=1';
  console.log(`Fetching ${url}...`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      console.error(`Failed: ${response.status} ${response.statusText}`);
      return;
    }
    
    const html = await response.text();
    console.log('Response length:', html.length);
    
    const $ = cheerio.load(html);
    const title = $('title').text();
    console.log('Page Title:', title);
    
    // Try to find some content
    const articles = $('article');
    console.log('Articles found:', articles.length);
    
    if (articles.length > 0) {
        console.log('First article text:', $(articles[0]).text().substring(0, 100));
    } else {
        // Maybe it's a list or div structure
        const items = $('.feed-item, .item, .entry'); 
        console.log('Items found (generic classes):', items.length);
        
        // Print first 500 chars of body to see structure if no articles found
        console.log('Body start:', $('body').html()?.substring(0, 500));
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testFolo();

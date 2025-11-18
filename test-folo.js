
const cheerio = require('cheerio');

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
    
    // Check for RSS links
    const rssLink = $('link[type="application/rss+xml"]').attr('href');
    const atomLink = $('link[type="application/atom+xml"]').attr('href');
    const jsonLink = $('link[type="application/json"]').attr('href');
    
    console.log('RSS Link:', rssLink);
    console.log('Atom Link:', atomLink);
    console.log('JSON Link:', jsonLink);

    // Check for script tags that might contain data
    $('script').each((i, el) => {
        const content = $(el).html();
        if (content && content.includes('Elon Musk')) {
            console.log(`Found script tag with content (length: ${content.length})`);
            console.log('--- SCRIPT CONTENT START ---');
            console.log(content);
            console.log('--- SCRIPT CONTENT END ---');
        }
    });
    
    // Print all links to see if there is an export
    // $('a').each((i, el) => {
    //     console.log('Link:', $(el).attr('href'));
    // });

  } catch (error) {
    console.error('Error:', error);
  }
}

testFolo();


const cheerio = require('cheerio');

async function testFoloTimeline() {
  // Try to convert the timeline URL to a share URL
  const id = '56446234310693888';
  const shareUrl = `https://app.folo.is/share/feeds/${id}`;
  console.log(`Fetching Share URL: ${shareUrl}...`);
  
  try {
    const response = await fetch(shareUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    console.log('Share URL Status:', response.status);
    if (response.ok) {
        const html = await response.text();
        console.log('Share URL Content Length:', html.length);
        if (html.includes('window.__HYDRATE__')) {
            console.log('SUCCESS: Found HYDRATE data in share URL!');
        } else {
            console.log('Share URL fetched but no HYDRATE data found.');
        }
    } else {
        console.log('Share URL not accessible.');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testFoloTimeline();

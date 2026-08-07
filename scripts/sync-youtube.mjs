// Pulls the latest videos from the Hillcrest YouTube channel via its public RSS
// feed (no API key needed) and writes src/data/sermons-videos.json.
// Run: npm run sync:youtube
import { writeFileSync, readFileSync } from 'node:fs';

const CHANNEL_ID = 'UCntIishf0ubZRWkQ7xxmOkw';
const OUT = new URL('../src/data/sermons-videos.json', import.meta.url);

const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`);
if (!res.ok) {
  console.error(`YouTube feed returned ${res.status}; keeping existing sermons-videos.json`);
  process.exit(0);
}
const xml = await res.text();

const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, entry]) => {
  const get = (re) => entry.match(re)?.[1] ?? '';
  return {
    id: get(/<yt:videoId>([^<]+)<\/yt:videoId>/),
    title: get(/<title>([^<]*)<\/title>/)
      .replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'")
      .replaceAll('&lt;', '<').replaceAll('&gt;', '>'),
    published: get(/<published>([^<]+)<\/published>/),
  };
}).filter(v => v.id);

if (!videos.length) {
  console.error('Feed parsed to zero videos; keeping existing sermons-videos.json');
  process.exit(0);
}

let previous = '';
try { previous = readFileSync(OUT, 'utf8'); } catch {}
const next = JSON.stringify({ synced_at: new Date().toISOString().slice(0, 10), videos }, null, 2) + '\n';
// Avoid churn when only synced_at would change
if (previous.replace(/"synced_at": "[^"]*"/, '') === next.replace(/"synced_at": "[^"]*"/, '')) {
  console.log('No new videos.');
} else {
  writeFileSync(OUT, next);
  console.log(`Wrote ${videos.length} videos.`);
}

import { readFile, access } from 'node:fs/promises';

const requiredFiles = ['index.html', 'styles.css', 'app.js', '404.html', 'site.webmanifest'];
const requiredPages = ['home', 'characters', 'chat', 'reviews', 'community', 'clubs', 'ai', 'archive', 'profile'];

for (const file of requiredFiles) await access(file);
const html = await readFile('index.html', 'utf8');
for (const page of requiredPages) {
  if (!html.includes(`id="${page}"`)) throw new Error(`Missing page panel: ${page}`);
  if (!html.includes(`data-page="${page}"`)) throw new Error(`Missing navigation target: ${page}`);
}
if (!html.includes('./styles.css') || !html.includes('./app.js')) throw new Error('Asset paths must be relative for static hosting.');
console.log(`Validated ${requiredFiles.length} production files and ${requiredPages.length} navigation targets.`);

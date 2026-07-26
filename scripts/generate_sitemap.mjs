// Generates public/sitemap.xml from the static routes plus the curated
// dictionary entries. Run with: npm run sitemap
//
// Only the hand-written entries get word URLs — the bulk PDF/Wiktionary
// imports are thin, near-duplicate pages that would dilute the sitemap.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { dictionaryData } from '../src/data/dictionary.ts';

const SITE_URL = 'https://awal-dictionary-app.web.app';

const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/learn', priority: '0.9', changefreq: 'weekly' },
    { path: '/tools', priority: '0.8', changefreq: 'monthly' },
    { path: '/tools/conjugator', priority: '0.8', changefreq: 'monthly' },
    { path: '/tools/quiz', priority: '0.8', changefreq: 'monthly' },
    { path: '/tools/community', priority: '0.7', changefreq: 'monthly' },
    { path: '/favorites', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/imprint', priority: '0.3', changefreq: 'yearly' },
];

// Curated entries carry an etymology, conjugation, or a hand-authored id —
// these are the pages worth surfacing to search engines.
const curated = dictionaryData.filter(
    e => e.source === undefined && (e.etymology || e.conjugation || e.category)
);

const today = new Date().toISOString().split('T')[0];

const urls = [
    ...STATIC_ROUTES.map(
        r => `  <url>
    <loc>${SITE_URL}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    ),
    ...curated.map(
        e => `  <url>
    <loc>${SITE_URL}/word/${e.id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);

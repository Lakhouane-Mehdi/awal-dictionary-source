// Generates public/sitemap.xml from the static routes plus the curated
// dictionary entries. Run with: npm run sitemap
//
// Only the hand-written entries get word URLs — the bulk PDF/Wiktionary
// imports are thin, near-duplicate pages that would dilute the sitemap.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { dictionaryData } from '../src/data/dictionary.ts';
import { categories, rootFamilies, ALPHABET_INDEX, letterCounts } from '../src/data/taxonomy.ts';
import { proverbs } from '../src/data/proverbs.ts';

const SITE_URL = 'https://awal-dictionary-app.web.app';

const STATIC_ROUTES = [
    { path: '/', priority: '1.0', changefreq: 'weekly' },
    { path: '/browse', priority: '0.9', changefreq: 'weekly' },
    { path: '/categories', priority: '0.9', changefreq: 'weekly' },
    { path: '/roots', priority: '0.9', changefreq: 'monthly' },
    { path: '/alphabet', priority: '0.9', changefreq: 'monthly' },
    { path: '/proverbs', priority: '0.9', changefreq: 'monthly' },
    { path: '/learn', priority: '0.9', changefreq: 'weekly' },
    { path: '/learn/vocabulary', priority: '0.7', changefreq: 'monthly' },
    { path: '/about', priority: '0.8', changefreq: 'monthly' },
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

const url = (loc, priority, changefreq = 'monthly') => `  <url>
    <loc>${SITE_URL}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const urls = [
    ...STATIC_ROUTES.map(r => url(r.path, r.priority, r.changefreq)),
    // A-Z browse pages that actually contain entries
    ...ALPHABET_INDEX.filter(l => (letterCounts[l] ?? 0) > 0).map(l =>
        url(`/browse?letter=${encodeURIComponent(l)}`, '0.6', 'weekly')
    ),
    ...categories.map(c => url(`/category/${c.slug}`, '0.8')),
    ...rootFamilies.map(r => url(`/root/${r.slug}`, '0.7')),
    ...proverbs.map(p => url(`/proverb/${p.id}`, '0.7')),
    ...curated.map(e => url(`/word/${e.id}`, '0.6')),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), '../public/sitemap.xml');
writeFileSync(outPath, xml, 'utf8');

console.log(`Wrote ${urls.length} URLs to public/sitemap.xml`);

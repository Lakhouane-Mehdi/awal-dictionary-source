# Awal — Tamazight-English Dictionary

An offline-first PWA for looking up Tamazight (Berber) words in English, and the
other way round.

© Mehdi Lakhouane. Not open source — see LICENSE.

## Scripts

Search with Tifinagh (ⴰⵣⵓⵍ), Latin (Azul), or Arabic (أزول) input. Latin input
converts to Tifinagh and Arabic as you type; converting from Tifinagh or Arabic
back to Latin is not built yet.

## Learning

XP and streaks with leagues and levels, randomized vocabulary quizzes, and
achievements. There's a verb conjugator with full tables, a trace mode for
learning to write Tifinagh characters, and text-to-speech for pronunciation.

Users can submit corrections and additions.

Proverbs can be shared as image cards.

## Offline

The full dictionary works with no connection. Favorites persist through
`idb-keyval`. The camera scanner is the exception: its OCR engine and language
data download on first use.

## Stack

React 19, TypeScript, Vite, Tailwind, Framer Motion. Hosted on Firebase.

Requires Node 24 (the version CI uses).

```bash
npm install
npm run dev     # local dev server
npm test        # unit tests
npm run build   # production build into dist/
npm run sitemap # regenerate public/sitemap.xml
```

## Monitoring

Errors go to Sentry only when `VITE_SENTRY_DSN` is set at build time and the
visitor has accepted analytics in the cookie banner.

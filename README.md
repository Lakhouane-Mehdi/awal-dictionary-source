# Awal — Tamazight-English Dictionary

An offline-first PWA for looking up Tamazight (Berber) words in English, and the
other way round.

© Mehdi Lakhouane. Source-available, not open source. The dictionary data comes
from third-party sources under their own licences; see LICENSE.

## Scripts

Search with Tifinagh (ⴰⵣⵓⵍ), Latin (Azul), or Arabic (أزول) input, and switch
the whole dictionary between the three. Conversion works in every direction
through standard IRCAM Latin, and search matches spellings across scripts and
transcriptions: "aghyul", "aɣyul", "ⴰⵖⵢⵓⵍ" and "أغيول" all find the same word,
and chat-style numerals (7 for ḥ, 9 for q, 3 for ɛ) work too.

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

Requires Node 24 or newer (CI uses 24).

```bash
npm install
npm run dev     # local dev server
npm test        # unit tests
npm run build   # production build into dist/
npm run sitemap # regenerate public/sitemap.xml
python scripts/make_icons.py  # redraw the app icons in public/ (needs Pillow)
```

## Dictionary data

The core vocabulary comes from `dictionary.pdf`. To rebuild
`src/data/dictionary.json` from it:

```bash
node scripts/import_pdf.mjs
```

The importer reads each text fragment's position on the page, so words stay
whole, wrapped lines rejoin their entry, and every section keeps its own
layout: both dictionary halves, the verb tables (infinitive, present
continuous, 1st person past), countries, and God phrases with their usage
notes. Entry IDs are derived from content, so re-running it never breaks
saved favourites or shared links; `src/__tests__/pdfImport.test.ts` checks
the result.

## Monitoring

Errors go to Sentry only when `VITE_SENTRY_DSN` is set at build time and the
visitor has accepted analytics in the cookie banner.

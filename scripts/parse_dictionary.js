
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawFile = path.join(__dirname, 'raw_content_js.txt');
const outputFile = path.join(__dirname, '../src/data/dictionary.json');

function parse() {
    const content = fs.readFileSync(rawFile, 'utf-8');
    const lines = content.split('\n');

    let section = 'unknown';
    const entries = [];

    // Regex for splitting: look for 2 or more spaces
    // But be careful about spaces inside descriptions
    const splitRegex = /\s{3,}/;

    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Detect Page/Section headers
        if (line.includes('English -­‐ Tamazight')) {
            section = 'English-Tamazight';
            continue;
        }
        if (line.includes('Tamazight -­‐ English')) {
            section = 'Tamazight-English';
            continue;
        }
        if (line.startsWith('--- Page')) continue;
        // Skip likely page numbers that slipped through (e.g. just a number)
        if (/^\d+$/.test(line)) continue;

        // Heuristic parsing
        if (section === 'English-Tamazight') {
            const parts = line.split(splitRegex);
            if (parts.length >= 2) {
                // Clean input: remove newlines, multiple spaces
                const en = parts[0].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
                const tam = parts[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

                // Skip if header-like or empty
                if (en.length < 2 || tam.length < 2) continue;

                entries.push({
                    english: en,
                    tamazight: tam,
                    section: 'eng-tam',
                    dialect: 'Zaouiat Ahansal'
                });
            }
        } else if (section === 'Tamazight-English') {
            const parts = line.split(splitRegex);
            if (parts.length >= 2) {
                // T-E section often has a period after the T-word: "word .   def"
                let tam = parts[0].trim().replace(/\.$/, '').trim();
                tam = tam.replace(/\n/g, ' ').replace(/\s+/g, ' ');

                const en = parts[1].replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

                if (en.length < 2 || tam.length < 2) continue;

                entries.push({
                    tamazight: tam,
                    english: en,
                    section: 'tam-eng',
                    dialect: 'Zaouiat Ahansal'
                });
            }
        }
    }

    console.log(`Parsed ${entries.length} entries.`);
    // Ensure directory exists
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
    console.log(`Saved to ${outputFile}`);
}

parse();

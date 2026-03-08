// Script to convert HuggingFace IRCAM Tamazight verbs TSV to JSON
const fs = require('fs');
const path = require('path');

const tsvPath = path.join(__dirname, 'tamazight_verbs.tsv');
const jsonPath = path.join(__dirname, '..', 'src', 'data', 'ircam_verbs.json');

const raw = fs.readFileSync(tsvPath, 'utf-8');
const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);

// First line is header: zgh_verbe\ten_meaning
const verbs = [];
const seen = new Set();

for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length < 2) continue;

    const tifinagh = parts[0].trim();
    const english = parts[1].trim();

    if (!tifinagh || !english) continue;

    // Deduplicate by tifinagh form
    if (seen.has(tifinagh)) continue;
    seen.add(tifinagh);

    verbs.push({
        tifinagh,
        english
    });
}

fs.writeFileSync(jsonPath, JSON.stringify(verbs, null, 2), 'utf-8');
console.log(`Converted ${verbs.length} unique verbs to ${jsonPath}`);

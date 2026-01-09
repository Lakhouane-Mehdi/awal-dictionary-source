
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

// Test 1: createRequire
try {
    const require = createRequire(import.meta.url);
    const pdf = require('pdf-parse');
    console.log('Require: Type:', typeof pdf);
    console.log('Require: Keys:', Object.keys(pdf));
    console.log('Require: String:', pdf.toString());
    if (typeof pdf === 'function') {
        runParse('Require', pdf);
    } else if (pdf.default && typeof pdf.default === 'function') {
        runParse('Require.default', pdf.default);
    }
} catch (e) {
    console.log('Require failed:', e.message);
}

// Test 2: Dynamic Import
(async () => {
    try {
        const pdfImport = await import('pdf-parse');
        console.log('Import: Type:', typeof pdfImport);
        console.log('Import: Keys:', Object.keys(pdfImport));
        if (pdfImport.default && typeof pdfImport.default === 'function') {
            runParse('Import.default', pdfImport.default);
        }
    } catch (e) {
        console.log('Import failed:', e.message);
    }
})();

function runParse(method, parseFn) {
    console.log(`\n--- Attempting parse with ${method} ---`);
    const pdfPath = path.resolve('dictionary.pdf');
    if (!fs.existsSync(pdfPath)) {
        console.log("PDF not found");
        return;
    }
    const buffer = fs.readFileSync(pdfPath);
    try {
        parseFn(buffer).then(data => {
            console.log(`SUCCESS with ${method}! Pages: ${data.numpages}`);
            console.log(data.text.substring(0, 500));
        }).catch(err => {
            console.log(`FAILED promise with ${method}:`, err.message);
        });
    } catch (e) {
        console.log(`FAILED sync with ${method}:`, e.message);
    }
}

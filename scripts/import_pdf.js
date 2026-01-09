
import fs from 'fs';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
console.log('Imported pdf module:', pdf);

const pdfPath = path.resolve('dictionary.pdf');

if (!fs.existsSync(pdfPath)) {
    console.error(`Error: File not found at ${pdfPath}`);
    process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);

// Handle potential ESM/CJS interop issue where the function is on .default
const parsePDF = pdf.default || pdf;

parsePDF(dataBuffer).then(function (data) {
    console.log(`Number of pages: ${data.numpages}`);
    console.log(`Info: ${JSON.stringify(data.info, null, 2)}`);
    console.log("\n\n--- CONTENT PREVIEW (First 2000 chars) ---\n");
    console.log(data.text.substring(0, 2000));
    console.log("\n--- END PREVIEW ---\n");

    // Save full raw text to a file for deeper inspection
    fs.writeFileSync('raw_pdf_content.txt', data.text);
    console.log("Full raw text saved to raw_pdf_content.txt");
}).catch(err => {
    console.error("Error parsing PDF:", err);
});

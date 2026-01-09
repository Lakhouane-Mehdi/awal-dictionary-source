
import fs from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = '../dictionary.pdf';
const outputRaw = 'raw_content_js.txt';

async function extractText() {
    try {
        const data = new Uint8Array(fs.readFileSync(pdfPath));
        const loadingTask = getDocument(data);
        const pdf = await loadingTask.promise;

        console.log(`PDF Loaded. Pages: ${pdf.numPages}`);
        let fullText = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();

            // Basic text extraction: join items with space
            // We might need better layout preservation later, but this tests if text exists.
            let lastY = -1;
            let lastX = -1;
            let lastWidth = 0;
            let pageText = '';

            for (const item of textContent.items) {
                if ('str' in item) {
                    const x = item.transform[4];
                    const y = item.transform[5];
                    const w = item.width;

                    if (lastY !== -1 && Math.abs(y - lastY) > 5) {
                        pageText += '\n';
                    } else if (lastY !== -1) {
                        const gap = x - (lastX + lastWidth);
                        if (gap > 10) {
                            pageText += '   '; // Insert wide space for column gap
                        } else if (!item.str.startsWith(' ') && !pageText.endsWith(' ')) {
                            pageText += ' ';
                        }
                    }

                    pageText += item.str;
                    lastY = y;
                    lastX = x;
                    lastWidth = w;
                }
            }
            fullText += `--- Page ${i} ---\n${pageText}\n\n`;

            if (i % 10 === 0) console.log(`Processed page ${i}`);
        }

        fs.writeFileSync(outputRaw, fullText);
        console.log(`Extraction complete. Saved to ${outputRaw}`);
        console.log("Preview:", fullText.substring(0, 500));

    } catch (err) {
        console.error("Extraction failed:", err);
    }
}

extractText();

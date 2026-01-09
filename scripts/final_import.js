
import fs from 'fs';
import path from 'path';

const pdfPath = path.resolve('dictionary.pdf');

if (!fs.existsSync(pdfPath)) {
    console.error("PDF not found");
    process.exit(1);
}

const dataBuffer = fs.readFileSync(pdfPath);

console.log("Importing pdf-parse...");
import('pdf-parse').then(async (pdfModule) => {
    console.log('Imported Module Type:', typeof pdfModule);
    console.log('Imported Module Keys:', Object.keys(pdfModule));

    let parseFunc = pdfModule.default;
    if (!parseFunc) {
        // Try to find a function in exports
        for (const key of Object.keys(pdfModule)) {
            if (typeof pdfModule[key] === 'function') {
                console.log(`Found function export: ${key}`);
                if (!parseFunc) parseFunc = pdfModule[key];
            }
        }
    }

    if (!parseFunc) {
        console.error("No function found.");
        // Maybe it exported the class as a named export 'PDFParse'?
        if (pdfModule.PDFParse) {
            console.log("Found PDFParse export (might be class)");
            parseFunc = pdfModule.PDFParse;
        }
    }

    if (parseFunc) {
        try {
            console.log(`Calling ${parseFunc.name || 'func'}...`);
            const result = await parseFunc(dataBuffer);
            console.log("Parsed!");
            console.log(result.text.substring(0, 500));
            fs.writeFileSync('raw_content.txt', result.text);
        } catch (e) {
            console.error("Call failed:", e.message);
            if (e.message.includes("constructor")) {
                try {
                    console.log("Trying new...");
                    const instance = new parseFunc(dataBuffer);
                    // What do we do with instance?
                    console.log("Instance created:", instance);
                } catch (e2) {
                    console.error("New failed:", e2.message);
                }
            }
        }
    }

}).catch(err => {
    console.error("Import error:", err);
});

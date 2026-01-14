
import fs from 'fs';
try {
    const pkg = fs.readFileSync('node_modules/pdf-parse/package.json', 'utf8');
    console.log(pkg);
} catch (e) {
    console.error(e);
}

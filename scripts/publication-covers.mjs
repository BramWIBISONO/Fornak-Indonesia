import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const assets = fileURLToPath(new URL('../public/assets/', import.meta.url));
const documents = path.join(assets, 'documents');
for (const name of readdirSync(documents).filter(name => name.endsWith('.pdf'))) {
  for (const width of [480, 900]) {
    const prefix = path.join(assets, 'images', 'sampul-' + path.basename(name, '.pdf') + '-' + width);
    const result = spawnSync('pdftoppm', ['-f','1','-l','1','-singlefile','-scale-to-x',String(width),'-scale-to-y','-1','-jpeg',path.join(documents,name),prefix], {stdio:'inherit'});
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status ?? 1);
  }
}

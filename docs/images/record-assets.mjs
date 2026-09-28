// Ported from Rennick & Hale: retain PNG sources, create WebP and record lineage.
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const hash = async (file) => crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex');
const manifest = await read('docs/images/test-set-manifest.json');
const records = await Promise.all((await fs.readdir('docs/images/records')).filter(f => f.endsWith('.json')).sort().map(f => read(`docs/images/records/${f}`)));
const rejected = await Promise.all((await fs.readdir('docs/images/rejected-records')).filter(f => f.endsWith('.json')).sort().map(f => read(`docs/images/rejected-records/${f}`)));
const initial = manifest.assets.filter(a => a.qa.status !== 'rejected');
const selected = [...initial, ...records];
if (selected.length !== 72) throw new Error(`Expected 72 generated sources, got ${selected.length}`);
const assets = [];
for (const record of selected) {
  if (record.qa.status !== 'accepted') throw new Error(`Unreviewed image: ${record.id}`);
  const destination = record.file
    ? `public/images/${record.directory ?? `products/${record.product}`}/${record.file}`
    : record.path.replace('docs/images/test-set/', 'public/images/');
  const source = record.path;
  const meta = await sharp(source).metadata();
  const expected = destination.includes('/materials/') ? [1254, 1254] : destination.includes('/editorial/') ? [1672, 941] : [1122, 1402];
  if (meta.width !== expected[0] || meta.height !== expected[1]) throw new Error(`${record.id}: ${meta.width}x${meta.height}, expected ${expected.join('x')}`);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  if (source !== destination) await fs.copyFile(source, destination);
  const webPath = destination.replace(/\.png$/, '.webp');
  await sharp(destination).webp({ quality: 85 }).toFile(webPath);
  const refs = [];
  for (const ref of record.refs ?? []) refs.push({ ...ref, sha256: ref.sha256 ?? await hash(ref.path) });
  assets.push({ ...record, path: destination, webPath, promptFile: record.promptFile ?? `docs/images/prompts/${record.id}.txt`, sourceType: 'generated', intent: 'new-photograph', generatedSourcePath: record.generatedSourcePath ?? record.source, refs, dimensions: { width: meta.width, height: meta.height }, nativeDimensions: { width: meta.width, height: meta.height }, resampling: 'none', sha256: await hash(destination) });
}
for (const record of [...manifest.assets.filter(a => a.qa.status === 'rejected'), ...rejected]) {
  const meta = await sharp(record.path).metadata();
  assets.push({ ...record, sourceType: 'generated', dimensions: { width: meta.width, height: meta.height }, sha256: await hash(record.path) });
}
manifest.version = 2;
manifest.status = 'Generated sources installed; derivatives and site QA pending';
manifest.assets = assets;
manifest.counts = { generationAttempts: assets.length, selectedSources: 72, rejected: assets.length - 72, derivedDetails: 0, derivedEditorials: 0, logicalDeliverables: 72 };
await fs.writeFile('docs/images/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(manifest.counts);

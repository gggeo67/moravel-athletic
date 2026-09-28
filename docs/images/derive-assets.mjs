// Ported from Rennick & Hale; only crops Moravel's accepted original sources.
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const manifest = JSON.parse(await fs.readFile('docs/images/manifest.json', 'utf8'));
const sources = manifest.assets.filter(a => a.sourceType === 'generated' && a.qa.status === 'accepted');
const specs = JSON.parse(await fs.readFile('docs/images/remaining-specs.json', 'utf8'));
specs.push({ handle: 'womens-training-legging', colors: ['black', 'slate'] }, { handle: 'mens-jogger', colors: ['black', 'slate'] });
const derived = [];
async function cropAsset(id, parent, destination, crop) {
  if (!parent) throw new Error(`Missing parent for ${id}`);
  await sharp(parent.path).extract(crop).webp({ quality: 88 }).toFile(destination);
  derived.push({ id, sourceType: 'derived-crop', path: destination, webPath: destination, tool: 'sharp', generatedDate: '2026-09-28', prompt: null, lineage: { parentId: parent.id, parentSha256: parent.sha256, operation: 'extract; WebP encode', crop }, refs: [parent.id], crop, dimensions: { width: crop.width, height: crop.height }, sha256: crypto.createHash('sha256').update(await fs.readFile(destination)).digest('hex'), qa: { status: 'pending', notes: 'Awaiting visual crop inspection' } });
}
for (const spec of specs) {
  const color = spec.colors[0];
  const sourcePath = `public/images/products/${spec.handle}/master-${color}-front.png`;
  const parent = sources.find(a => a.path === sourcePath);
  const top = spec.handle === 'womens-sports-bra' ? 520 : spec.handle.includes('tee') || spec.handle.includes('hoodie') || spec.handle.includes('quarter') ? 300 : 170;
  await cropAsset(`${spec.handle}-detail`, parent, `public/images/products/${spec.handle}/detail-${color}.webp`, { left: 280, top, width: 561, height: 561 });
}
const crops = [
  ['collection-line-one', 'mens-training-tee'], ['collection-line-two', 'womens-sports-bra'], ['collection-line-three', 'mens-training-short'],
  ['category-leggings', 'womens-training-legging'], ['category-joggers', 'womens-jogger'], ['category-shorts', 'mens-training-short'], ['category-tees', 'mens-training-tee'], ['category-bras', 'womens-sports-bra'], ['category-quarter-zips', 'mens-quarter-zip'], ['category-hoodies', 'womens-zip-hoodie'],
  ['story-1', 'womens-jogger'], ['story-2', 'womens-training-tee'], ['story-3', 'womens-bike-short'], ['story-4', 'mens-training-short'], ['gift-guide', 'mens-hoodie'],
];
for (const [id, product] of crops) {
  const parent = sources.find(a => a.product === product && /\/model-[^/]+-front\.png$/.test(a.path));
  await cropAsset(id, parent, `public/images/editorial/${id}.webp`, { left: 94, top: 0, width: 934, height: 1402 });
}
manifest.assets = [...manifest.assets.filter(a => a.sourceType !== 'derived-crop'), ...derived];
manifest.counts.derivedDetails = 11;
manifest.counts.derivedEditorials = 15;
manifest.counts.logicalDeliverables = 98;
manifest.status = '98 deliverables installed; final visual QA pending';
await fs.writeFile('docs/images/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('Wrote 11 detail crops and 15 editorial crops.');

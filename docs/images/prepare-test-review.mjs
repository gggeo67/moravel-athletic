import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

// Run from the Moravel repository. Never writes to the reference repository or public/.
const root = 'docs/images';
const existingManifest = JSON.parse(await fs.readFile(`${root}/manifest.json`, 'utf8'));
if (existingManifest.version >= 2) throw new Error('The approved full manifest is installed. The archived test review must not overwrite it.');
const referenceRoot = path.resolve('../rennick_hale');
const attempts = JSON.parse(await fs.readFile(`${root}/test-attempts.json`, 'utf8'));
const referenceManifest = JSON.parse(await fs.readFile(`${referenceRoot}/docs/images/manifest.json`, 'utf8'));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const referenceIds = {
  'legging-black-front': 'alder-coal-front', 'legging-black-back': 'alder-coal-back',
  'legging-slate-front': 'alder-reed-front', 'legging-slate-back': 'alder-reed-back-v2',
  'legging-model-front': 'alder-model-front', 'legging-model-back': 'alder-model-back',
  'jogger-black-front': 'rowan-coal-front', 'jogger-black-back': 'rowan-coal-back-v4',
  'jogger-slate-front': 'rowan-silt-front', 'jogger-slate-back': 'rowan-silt-back-v3',
  'jogger-model-front': 'rowan-model-front', 'jogger-model-back': 'rowan-model-back',
  'home-hero': 'home-hero',
};
const approvedDate = null;
const assets = [];
await fs.mkdir(`${root}/prompts`, {recursive: true});
await fs.mkdir(`${root}/review`, {recursive: true});
for (const attempt of attempts) {
  const rejected = Boolean(attempt.rejectionReason);
  const relative = rejected ? `rejected/${attempt.id}.png` : `test-set/${attempt.product ? `products/${attempt.product}` : 'editorial'}/${attempt.file}`;
  const destination = `${root}/${relative}`;
  await fs.mkdir(path.dirname(destination), {recursive: true});
  await fs.copyFile(attempt.source, destination);
  const bytes = await fs.readFile(destination);
  const meta = await sharp(bytes).metadata();
  const expected = attempt.product ? [1122, 1402] : [1672, 941];
  if (!rejected && (meta.width !== expected[0] || meta.height !== expected[1])) throw new Error(`Unexpected dimensions: ${attempt.id} ${meta.width}x${meta.height}`);
  const promptFile = `${root}/prompts/${attempt.id}.txt`;
  await fs.writeFile(promptFile, attempt.prompt + '\n');
  const refs = await Promise.all(attempt.refs.map(async ref => ({...ref, sha256: hash(await fs.readFile(ref.path))})));
  const reference = referenceIds[attempt.id] && referenceManifest.assets.find(a => a.id === referenceIds[attempt.id]);
  let comparison = null;
  if (reference) {
    const referencePath = path.join(referenceRoot, reference.path);
    const referenceHash = hash(await fs.readFile(referencePath));
    if (referenceHash === hash(bytes)) throw new Error(`Reused reference bytes: ${attempt.id}`);
    comparison = {id: reference.id, path: referencePath, sha256: referenceHash, role: 'Review comparison only; not a generation input unless separately listed as identity reference'};
  }
  const webPath = rejected ? null : destination.replace(/\.png$/, '.webp');
  if (webPath) await sharp(bytes).webp({quality: 88}).toFile(webPath);
  assets.push({id: attempt.id, product: attempt.product, sourceType: 'generated', intent: 'new-photograph', tool: 'built-in image_gen', generatedDate: '2026-09-28', path: destination, webPath, generatedSourcePath: attempt.source, promptFile, prompt: attempt.prompt, refs, comparison, sha256: hash(bytes), dimensions: {width: meta.width, height: meta.height}, nativeDimensions: {width: meta.width, height: meta.height}, resampling: 'none', qa: {status: rejected ? 'rejected' : 'review-ready', notes: attempt.rejectionReason || 'Visually inspected for identity where applicable, garment construction, anatomy, tonal mark, new setting and styling. User approval pending.', colorCheck: 'Visual colour-family review; hex values are design targets, not measured fabric colours.', typographyCheck: 'Generated condensed sans treatment; exact font geometry cannot be certified.'}});
}
const selected = assets.filter(a => a.qa.status === 'review-ready');
if (selected.length !== 13) throw new Error(`Expected 13 selected sources, got ${selected.length}`);
const palette = {Black: '#111111', White: '#F2F2F0', Slate: '#4A4F57', 'Signal Blue': '#1F5BFF'};
const manifest = {version: 1, status: 'Test set only; awaiting user image and palette approval', approval: {date: approvedDate, scope: null}, counts: {generationAttempts: assets.length, selectedSources: selected.length, rejected: assets.length-selected.length, derivedDetails: 0, derivedEditorials: 0, logicalDeliverables: selected.length}, fullBatchTarget: {selectedSources: 72, derivedDetails: 11, derivedEditorials: 15, logicalDeliverables: 98}, palette: {status: 'proposed', colors: palette}, limitations: ['Reference hashes and tool records document lineage; hash differences alone do not prove visual originality.', 'AI-generated identity, garment details and condensed letterforms require visual review.', 'Neither exact dye colours nor physical garment measurements can be certified from generated pixels.'], assets};
await fs.writeFile(`${root}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');

const notes = id => id === 'home-hero' ? 'R&H: softly lit limestone stroll and white styling. Moravel: blue running track, active strides, hard sunlight and dark styling. Same two fictional identities.' : id.includes('model') ? 'Same fictional person; new athletic pose, gym or city setting, directional light and dark styling. No R&H garment master supplied.' : 'Fresh Moravel generation with cool grey backdrop, directional shadows and Moravel construction/branding. R&H mannequin shown for comparison only; it was never supplied to the generator.';
const orders = [
  ['Women’s Training Legging', ['legging-black-front','legging-black-back','legging-slate-front','legging-slate-back','legging-model-front','legging-model-back']],
  ['Men’s Jogger', ['jogger-black-front','jogger-black-back','jogger-slate-front','jogger-slate-back','jogger-model-front','jogger-model-back']],
  ['Home hero', ['home-hero']],
];
const sections = [];
for (const [title, ids] of orders) {
  const rows = [];
  const panels = [];
  const sheetWidth = 1600;
  const panelWidth = ids.length === 1 ? 800 : 400;
  const imageHeight = ids.length === 1 ? 450 : 500;
  const rowHeight = imageHeight + 56;
  for (let index = 0; index < ids.length; index++) {
    const a = selected.find(a => a.id === ids[index]);
    const refBytes = await sharp(a.comparison.path).resize({width: 800}).webp({quality: 82}).toBuffer();
    const embedded = `data:image/webp;base64,${refBytes.toString('base64')}`;
    const local = a.webPath.replace(`${root}/`, '');
    rows.push(`<article><h3>${escape(a.id)}</h3><div class="pair"><figure><img src="${embedded}" alt="Rennick and Hale reference: ${escape(a.id)}"><figcaption>Rennick &amp; Hale · comparison only</figcaption></figure><figure><a href="${escape(local.replace('.webp','.png'))}"><img src="${escape(local)}" alt="New Moravel Athletic: ${escape(a.id)}"></a><figcaption>Moravel Athletic · ${a.dimensions.width} × ${a.dimensions.height}</figcaption></figure></div><p>${notes(a.id)}</p><details><summary>Prompt and provenance</summary><pre>${escape(a.prompt)}</pre><p>Inputs: ${escape(a.refs.map(r => r.role).join('; ') || 'Text only')}</p><p>SHA-256: <code>${a.sha256}</code></p></details></article>`);
    for (let side=0; side<2; side++) {
      const column = ids.length === 1 ? side : (index % 2) * 2 + side;
      const row = ids.length === 1 ? 0 : Math.floor(index / 2);
      const slot = side ? a.id.replace('legging-','').replace('jogger-','') : path.basename(a.comparison.path, '.png').replace('master-','');
      const label = `${side ? 'MORAVEL' : 'R&H'} / ${slot}`;
      const header = Buffer.from(`<svg width="${panelWidth}" height="56"><rect width="100%" height="100%" fill="${side ? '#111111' : '#E5E7EB'}"/><text x="12" y="34" font-family="sans-serif" font-size="17" fill="${side ? '#FFFFFF' : '#111111'}">${escape(label)}</text></svg>`);
      panels.push({input: header, left: column*panelWidth, top: row*rowHeight});
      panels.push({input: await sharp(side ? a.path : a.comparison.path).resize(panelWidth,imageHeight,{fit:'contain',background:'#E5E7EB'}).png().toBuffer(), left:column*panelWidth,top:row*rowHeight+56});
    }
  }
  const sheetName = title.startsWith('Women') ? 'legging-comparison' : title.startsWith('Men') ? 'jogger-comparison' : 'hero-comparison';
  await sharp({create:{width:sheetWidth,height:rowHeight*(ids.length===1?1:3),channels:3,background:'#FFFFFF'}}).composite(panels).png().toFile(`${root}/review/${sheetName}.png`);
  sections.push(`<section><h2>${escape(title)}</h2>${rows.join('')}</section>`);
}
const swatches = Object.entries(palette).map(([name,hex]) => `<div><i style="background:${hex}"></i><strong>${name}</strong> ${hex}</div>`).join('');
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Moravel Athletic — 13-image approval set</title><style>*{box-sizing:border-box}body{margin:0;background:#F2F2F0;color:#111;font:16px/1.5 system-ui}main{max-width:1280px;margin:auto;padding:32px}h1{font-size:38px}h2{border-top:3px solid #111;padding-top:24px;margin-top:60px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{width:100%;display:block}figcaption{padding:10px 0;font-weight:700}article{margin:32px 0 56px}aside{background:#fff;padding:24px;border-left:5px solid #1F5BFF}.swatches{display:flex;flex-wrap:wrap;gap:24px}.swatches i{display:block;width:110px;height:55px;border:1px solid #888}pre{white-space:pre-wrap}code{overflow-wrap:anywhere}summary{cursor:pointer}a{color:#1545C0}@media(max-width:600px){main{padding:16px}h1{font-size:28px}.pair{gap:8px}figcaption{font-size:12px}}</style><main><h1>Moravel Athletic</h1><p>13-image test set · 28 September 2026 · awaiting approval</p><aside>Eight mannequin photographs, four model photographs and one hero. All are new image-generator outputs. R&amp;H photographs appear here only for comparison; only its two model identity photographs were generation inputs. No R&amp;H garment master or Gymshark photograph was supplied. Nothing is installed or published.</aside><h2>Palette for approval</h2><div class="swatches">${swatches}</div><p>Black / Slate: legging, sports bra, bike short, women’s jogger, zip hoodie, men’s jogger. White / Signal Blue: women’s tee. White / Black: men’s tee. Black / Signal Blue: men’s short and quarter-zip. Slate / Black: men’s hoodie.</p><h2>Copy preview for installation</h2><p>Colour sentence: “Black, White, Slate and Signal Blue. Select a color on any product page to see it.”</p><p>Alt-text pattern: “[Product] in [Colour], front/back garment view” for masters; descriptions of the visible activity for model views. Hero: “Two athletes running on a blue track in Black Moravel Athletic leggings and joggers.” Gift card: “Matte black Moravel Athletic gift card.” Other page copy remains unchanged.</p><p>Read the <a href="manifest.json">manifest</a> for exact prompts, input roles, hashes, native dimensions and QA. There are ${manifest.counts.rejected} rejected attempts: one branding treatment and two undersized outputs. Hash differences establish distinct files, not proof of originality on their own; generation records and visual differences provide the supporting evidence.</p>${sections.join('')}<h2>Approval gate</h2><p>Approve or request changes to these 13 photographs and the proposed palette. The remaining 59 sources, 26 crops, site installation, checks, commit and production push follow only after that approval.</p></main></html>`;
await fs.writeFile(`${root}/test-set.html`, html);
console.log(JSON.stringify({counts:manifest.counts,review:`${root}/test-set.html`},null,2));

import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const origin = 'http://127.0.0.1:3019';
const directory = 'docs/qa/screens/image-revision';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];
const errors = [];
try {
  for (const [width, deviceScaleFactor] of [[390, 1], [1440, 1], [2048, 1], [2048, 2]]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push({ width, deviceScaleFactor, message: error.message }));
    for (const [name, route, sections] of [
      ['home', '/', ['.hero', '.fabric-grid']],
      ['journal', '/blogs/journal', ['.fabric-grid']],
      ['gift-guide', '/pages/gift-guide', ['.gift-guide-banner']],
    ]) {
      const response = await page.goto(origin + route);
      await page.waitForLoadState('networkidle');
      const state = await page.evaluate(async () => {
        const images = [...document.images];
        for (const image of images) image.loading = 'eager';
        await Promise.all(images.map(image => image.decode().catch(() => null)));
        const portraits = [...document.querySelectorAll('.editorial-photo, .gift-guide-banner .banner-photo')].map(container => {
          const box = container.getBoundingClientRect();
          return { width: box.width, height: box.height, ratio: box.width / box.height };
        });
        const hero = document.querySelector('.hero-photo img');
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          brokenImages: images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src),
          portraits,
          hero: hero ? { currentSrc: hero.currentSrc, naturalWidth: hero.naturalWidth, naturalHeight: hero.naturalHeight, renderedWidth: hero.clientWidth, renderedHeight: hero.clientHeight, objectPosition: getComputedStyle(hero).objectPosition } : null,
        };
      });
      if (state.hero) {
        const imageResponse = await fetch(state.hero.currentSrc, { headers: { Accept: 'image/avif,image/webp,*/*' } });
        const bytes = Buffer.from(await imageResponse.arrayBuffer());
        const metadata = await sharp(bytes).metadata();
        state.hero.deliveredPixels = { width: metadata.width, height: metadata.height, bytes: bytes.length };
        state.hero.requiredWidthAtDpr = Math.ceil(Math.max(state.hero.renderedWidth, state.hero.renderedHeight * 1672 / 941) * deviceScaleFactor);
      }
      const prefix = `${directory}/${name}-${width}-${deviceScaleFactor}x`;
      await page.screenshot({ path: `${prefix}.png`, fullPage: true });
      for (const selector of sections) {
        await page.locator(selector).screenshot({ path: `${prefix}-${selector.slice(1)}.png` });
      }
      report.push({ name, route, width, deviceScaleFactor, status: response.status(), ...state, screenshot: `${prefix}.png` });
      console.log(`Captured ${name}: ${width}px, DPR ${deviceScaleFactor}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile('docs/qa/image-revision-results.json', JSON.stringify({ date: '2026-09-28', origin, report, errors }, null, 2) + '\n');
}
if (errors.length || report.some(r => r.status !== 200 || r.overflow || r.brokenImages.length || r.portraits.some(p => Math.abs(p.ratio - 2 / 3) > 0.001))) {
  throw new Error('Image revision QA failed; see docs/qa/image-revision-results.json');
}
console.log(`PASS: ${report.length} captures; full 2:3 portraits, no broken images, page errors or overflow.`);

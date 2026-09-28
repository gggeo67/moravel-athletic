import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import { products } from '../../src/content/catalog.ts';

const origin = 'http://127.0.0.1:3019';
const directory = 'docs/qa/screens/images';
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = [];
const errors = [];
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push({ width, url: page.url(), message: error.message }));
    const routes = [['home', '/'], ['women', '/collections/womens'], ['men', '/collections/mens'], ...products.map(p => [p.handle, `/products/${p.handle}`])];
    for (const [name, route] of routes) {
      const response = await page.goto(origin + route);
      await page.waitForLoadState('networkidle');
      const product = products.find(p => p.handle === name);
      for (const color of product?.colors ?? [null]) {
        if (color && product.kind === 'apparel') await page.getByRole('button', { name: color.name, exact: true }).click();
        const state = await page.evaluate(async () => {
          const images = [...document.images];
          for (const image of images) image.loading = 'eager';
          await Promise.all(images.map(image => image.decode().catch(() => null)));
          return { overflow: document.documentElement.scrollWidth > innerWidth, brokenImages: images.filter(image => !image.complete || !image.naturalWidth).map(image => image.src), images: images.length };
        });
        const filename = `${name}-${color?.name.toLowerCase().replaceAll(' ', '-') ?? 'page'}-${width}.png`;
        await page.screenshot({ path: `${directory}/${filename}`, fullPage: true });
        report.push({ name, route, color: color?.name ?? null, width, status: response.status(), ...state, screenshot: `${directory}/${filename}` });
      }
      console.log(`Captured ${name} at ${width}px`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await writeFile('docs/qa/image-site-results.json', JSON.stringify({ date: '2026-09-28', origin, report, errors }, null, 2) + '\n');
}
if (errors.length || report.some(r => r.status !== 200 || r.overflow || r.brokenImages.length)) throw new Error('Image site QA failed; see report');
console.log(`PASS: ${report.length} page/colour/viewport captures, no broken images, page errors or overflow.`);

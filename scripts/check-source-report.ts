import { GET } from '../src/app/api/cron/request-sources/route';
const old = process.env.CRON_SECRET;
process.env.CRON_SECRET = 'local-check-only';
const originalFetch = globalThis.fetch;
const captured: unknown[] = [];
globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
  if (String(input).includes('.posthog.com/')) { captured.push(JSON.parse(String(init?.body))); return new Response('{}'); }
  return originalFetch(input, init);
}) as typeof fetch;
try {
  const bad = await GET(new Request('http://localhost/api/cron/request-sources'));
  if (bad.status !== 401) throw new Error('Cron authorization failed');
  for (let i=0;i<2;i++) {
    const response = await GET(new Request('http://localhost/api/cron/request-sources',{headers:{authorization:'Bearer local-check-only'}}));
    if (response.status !== 200) throw new Error('Cron SQL or export failed');
  }
  const payload = JSON.stringify(captured);
  if (/@|request_ref|order_ref|email|landing_path/.test(payload)) throw new Error('Customer data in aggregate export');
  if (!payload.includes('request_source_report_run')) throw new Error('Report freshness missing');
  console.log('Authenticated aggregate query, repeat runs, and payload privacy passed');
} finally { globalThis.fetch = originalFetch; if(old === undefined) delete process.env.CRON_SECRET; else process.env.CRON_SECRET = old; }

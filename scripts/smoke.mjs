import assert from 'node:assert/strict';

const base = (process.env.SMOKE_BASE_URL || 'http://localhost:3003').replace(/\/$/, '');
const origin = new URL(process.env.SMOKE_ORIGIN || base).origin;
const canonical = (process.env.SMOKE_CANONICAL || origin).replace(/\/$/, '');
const humanAgent = 'Mozilla/5.0 SPEAKOFTHE-Release-Check';
async function request(path, options = {}) {
  return fetch(base + path, {
    ...options,
    headers: { 'user-agent': humanAgent, ...options.headers },
    signal: AbortSignal.timeout(30000),
  });
}
for (const [path, text] of [['/', 'SOFTWARE'], ['/careers', 'No vacancies'], ['/privacy-policy', 'Privacy']]) {
  const response = await request(path);
  assert.equal(response.status, 200, `${path} status`);
  const html = await response.text();
  assert.ok(html.toLowerCase().includes(text.toLowerCase()), `${path} content`);
  assert.ok(html.includes(canonical), `${path} canonical origin`);
  assert.ok(!html.includes('mailto:'), `${path} has no mailto`);
}
const human = await (await request('/')).text();
const robot = await (await request('/', { headers: { 'user-agent': 'Googlebot' } })).text();
assert.ok(human.includes('<canvas'), 'Human hero has WebGL canvas');
assert.ok(!robot.includes('<canvas'), 'Crawler hero omits WebGL canvas');
assert.ok(!robot.includes('role="status" aria-live="polite" class="sr-only">Loading SPEAKOFTHE'), 'Crawler skips mounted loader');
const robotRedirect = await request('/robot-view', { redirect: 'manual' });
assert.ok([307, 308].includes(robotRedirect.status));
const robotLocation = new URL(robotRedirect.headers.get('location'), base);
assert.ok([new URL(base).origin, new URL(canonical).origin].includes(robotLocation.origin), 'Robot redirect stays on the public request origin');
assert.equal(robotLocation.pathname, '/');
const rsc = await request('/careers?_rsc=release-check', { headers: { RSC: '1' } });
assert.equal(rsc.status, 200, 'RSC navigation response');
assert.ok(rsc.headers.get('content-type')?.includes('text/x-component'), 'RSC header and query reach Next');
const redirect = await request('/contact', { redirect: 'manual' });
assert.equal(redirect.status, 308);
assert.ok(redirect.headers.get('location')?.endsWith('/#contact'));
const worker = await request('/service-worker.js');
assert.equal(worker.status, 200);
assert.ok(worker.headers.get('cache-control')?.includes('no-store'));
assert.ok((await worker.text()).includes('unregister'));
const assetPath = human.match(/src="([^\"]*\/_next\/static\/[^\"]+\.js)"/)?.[1];
assert.ok(assetPath, 'Next chunk rendered');
assert.equal((await request(assetPath)).status, 200);
const video = await request('/assets/backgrounds/neon-ribbon-waves-1080.mp4', { headers: { Range: 'bytes=0-99' } });
assert.equal(video.status, 206, 'Video supports byte ranges');
assert.match(video.headers.get('content-range') || '', /^bytes 0-99\/\d+$/);
assert.ok(video.headers.get('content-type')?.includes('video/mp4'));
assert.equal((await video.arrayBuffer()).byteLength, 100);
const revealHeaders = { origin, 'sec-fetch-site': 'same-origin', 'content-type': 'application/json' };
const reveal = await request('/api/contact-email', { method: 'POST', headers: revealHeaders, body: JSON.stringify({ action: 'reveal' }) });
assert.equal(reveal.status, 200, 'Contact reveal succeeds through the configured public origin');
assert.equal(reveal.headers.get('cache-control'), 'no-store');
const email = (await reveal.json()).data?.email;
assert.match(email || '', /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
assert.ok(!human.includes(email) && !robot.includes(email), 'Address is absent from initial HTML');
for (const [headers, body, expected] of [
  [{ ...revealHeaders, origin: 'https://foreign.example' }, { action: 'reveal' }, 403],
  [revealHeaders, { action: 'invalid' }, 400],
]) {
  assert.equal((await request('/api/contact-email', { method: 'POST', headers, body: JSON.stringify(body) })).status, expected);
}
assert.equal((await request('/api/contact-email')).status, 405);
console.log('Smoke checks passed: pages, canonical URLs, crawler routing, redirects, old-worker cleanup, static chunks, video ranges and protected email reveal.');

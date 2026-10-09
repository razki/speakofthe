import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const { NextRequest } = require("next/server");
const publicOrigin = "https://speakofthe.com";
const testAddress = "contact@example.test";

// Execute the real route, env schema and shared response wrapper with isolated
// test-only environment values; no application secrets or running server needed.
function loadModule(path, overrides = {}, environment = {}) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    require: (name) => Object.hasOwn(overrides, name) ? overrides[name] : require(name),
    process: { env: environment },
    console,
    URL,
    SyntaxError,
    Error,
  }, { filename: path });
  return exports;
}

function route(environment = {}) {
  const env = loadModule("src/env.ts", {}, environment);
  const contact = loadModule("src/data/contact.server.ts", { "server-only": {}, "@/env": env });
  const api = loadModule("src/lib/api/index.ts");
  return loadModule("src/app/api/contact-email/route.ts", {
    "@/env": env,
    "@/data/contact.server": contact,
    "@/lib/api": api,
  });
}

async function reveal(handler, {
  url = "http://internal-runtime:8080/api/contact-email",
  origin = publicOrigin,
  fetchSite = "same-origin",
  body = JSON.stringify({ action: "reveal" }),
} = {}) {
  const headers = { "content-type": "application/json" };
  if (origin !== null) headers.origin = origin;
  if (fetchSite !== null) headers["sec-fetch-site"] = fetchSite;
  const response = await handler.POST(new NextRequest(url, {
    method: "POST", headers, body,
  }), { params: Promise.resolve({}) });
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow");
  return response;
}

test("canonical HTTPS origin works behind an internal HTTP runtime", async () => {
  const handler = route({ NEXT_PUBLIC_SITE_URL: `${publicOrigin}/`, CONTACT_EMAIL: testAddress });
  const response = await reveal(handler);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { data: { email: testAddress } });
  assert.equal(Object.hasOwn(handler, "GET"), false);
});

test("unconfigured public origin supports local same-origin requests", async () => {
  const handler = route({ CONTACT_EMAIL: testAddress });
  const response = await reveal(handler, {
    url: "http://localhost:3003/api/contact-email", origin: "http://localhost:3003",
  });
  assert.equal(response.status, 200);
});

test("reject missing/foreign/internal origins and cross-site fetches", async () => {
  const handler = route({ NEXT_PUBLIC_SITE_URL: publicOrigin, CONTACT_EMAIL: testAddress });
  for (const options of [
    { origin: null },
    { origin: "https://other.example" },
    { origin: "http://internal-runtime:8080" },
    { fetchSite: "cross-site" },
    { fetchSite: "same-site" },
  ]) {
    const response = await reveal(handler, options);
    assert.equal(response.status, 403);
    assert.equal((await response.json()).error.code, "forbidden");
  }
});

test("validate reveal payload and empty query before returning data", async () => {
  const handler = route({ NEXT_PUBLIC_SITE_URL: publicOrigin, CONTACT_EMAIL: testAddress });
  for (const options of [
    { body: "{" },
    { body: JSON.stringify({ action: "reveal", extra: true }) },
    { body: JSON.stringify({ action: "other" }) },
    { url: "http://internal-runtime:8080/api/contact-email?extra=1" },
  ]) {
    const response = await reveal(handler, options);
    assert.equal(response.status, 400);
    assert.ok((await response.json()).error);
  }
});

test("missing or blank runtime address returns 503 without a data payload", async () => {
  for (const contactEmail of [undefined, ""]) {
    const handler = route({ NEXT_PUBLIC_SITE_URL: publicOrigin, CONTACT_EMAIL: contactEmail });
    const response = await reveal(handler);
    assert.equal(response.status, 503);
    const payload = await response.json();
    assert.equal(payload.error.code, "contact_unavailable");
    assert.equal(Object.hasOwn(payload, "data"), false);
  }
});

test("server environment validates configured email syntax", () => {
  const env = loadModule("src/env.ts", {}, { CONTACT_EMAIL: "not-an-address" });
  assert.throws(() => env.getServerEnv(), { name: "ZodError" });
});

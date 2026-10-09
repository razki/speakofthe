import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const source = readFileSync(new URL("../public/service-worker.js", import.meta.url), "utf8");
const origin = "https://speakofthe.com";
const scope = `${origin}/`;

function worker({ cacheNames = [], windows = [], deleteFailure } = {}) {
  const listeners = new Map();
  const stored = new Set(cacheNames);
  const deleted = [];
  const navigated = [];
  let registered = true;
  let skipped = 0;
  let unregistered = 0;
  let claimed = 0;
  let controlledWindows = [...windows];

  const context = vm.createContext({
    URL,
    caches: {
      keys: async () => [...stored],
      delete: async (name) => {
        if (name === deleteFailure) throw new Error("Cache unavailable");
        deleted.push(name);
        return stored.delete(name);
      },
    },
    self: {
      location: { origin },
      addEventListener: (name, listener) => listeners.set(name, listener),
      skipWaiting: async () => { skipped += 1; },
      registration: {
        scope,
        unregister: async () => {
          unregistered += 1;
          const wasRegistered = registered;
          registered = false;
          return wasRegistered;
        },
      },
      clients: {
        claim: async () => { claimed += 1; },
        matchAll: async (options) => {
          assert.equal(options.type, "window");
          assert.notEqual(options.includeUncontrolled, true);
          return controlledWindows.map((url) => ({
            url,
            navigate: async (destination) => {
              assert.equal(registered, false, "unregister before refreshing");
              assert.equal(destination, url, "preserve pathname, query and hash");
              navigated.push(destination);
              controlledWindows = controlledWindows.filter((current) => current !== url);
            },
          }));
        },
      },
    },
  });
  vm.runInContext(source, context, { filename: "service-worker.js" });

  return {
    async dispatch(name) {
      const pending = [];
      listeners.get(name)({ waitUntil: (promise) => pending.push(promise) });
      await Promise.all(pending);
    },
    listeners,
    stored,
    deleted,
    navigated,
    get skipped() { return skipped; },
    get unregistered() { return unregistered; },
    get claimed() { return claimed; },
  };
}

test("first visit: no claiming, fetch interception or forced navigation", async () => {
  const instance = worker({ cacheNames: ["user-settings"] });
  await instance.dispatch("install");
  await instance.dispatch("activate");
  assert.equal(instance.skipped, 1);
  assert.equal(instance.unregistered, 1);
  assert.equal(instance.claimed, 0);
  assert.equal(instance.listeners.has("fetch"), false);
  assert.deepEqual(instance.navigated, []);
  assert.deepEqual(instance.deleted, []);
});

test("legacy upgrade: delete only this scope's CRA precaches and refresh controlled local windows", async () => {
  const legacy = [
    `workbox-precache-v2-${scope}`,
    `workbox-precache-${scope}`,
    `sw-precache-v3-sw-precache-webpack-plugin-${scope}`,
  ];
  const preserved = [
    "user-settings",
    `workbox-runtime-${scope}`,
    `workbox-precache-v2-${origin}/other-app/`,
    "workbox-precache-v2-https://other.example/",
    `sw-precache-v3-another-project-${scope}`,
  ];
  const home = `${origin}/?ref=returning#contact`;
  const careers = `${origin}/careers`;
  const instance = worker({
    cacheNames: [...legacy, ...preserved],
    windows: [home, careers, "https://other.example/"],
  });
  await instance.dispatch("install");
  await instance.dispatch("activate");
  assert.deepEqual(instance.deleted.sort(), legacy.sort());
  assert.deepEqual([...instance.stored].sort(), preserved.sort());
  assert.deepEqual(instance.navigated, [home, careers]);
  assert.equal(instance.claimed, 0);
});

test("retired worker cannot create a navigation loop on repeated activation", async () => {
  const instance = worker({ windows: [`${origin}/careers`] });
  await instance.dispatch("activate");
  await instance.dispatch("activate");
  assert.deepEqual(instance.navigated, [`${origin}/careers`]);
});

test("one failed cache deletion does not retain the old registration or block other cleanup", async () => {
  const failing = `workbox-precache-v1-${scope}`;
  const removed = `workbox-precache-v2-${scope}`;
  const instance = worker({
    cacheNames: [failing, removed],
    deleteFailure: failing,
    windows: [scope],
  });
  await instance.dispatch("activate");
  assert.deepEqual(instance.deleted, [removed]);
  assert.equal(instance.unregistered, 1);
  assert.deepEqual(instance.navigated, [scope]);
});

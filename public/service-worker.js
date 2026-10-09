/* Retire the former CRA worker at its original URL. Never register this from Next. */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const scopeSuffix = `-${self.registration.scope}`;
    const names = await caches.keys();
    // Workbox and older CRA sw-precache include their registration scope in the name.
    // Leave other applications' precaches, runtime caches and user data alone.
    const legacyNames = names.filter((name) => (
      /^workbox-precache(?:-v\d+)?-/.test(name)
      || /^sw-precache-v?\d+(?:\.\d+)*-sw-precache-webpack-plugin-/.test(name)
    ) && name.endsWith(scopeSuffix));
    await Promise.allSettled(legacyNames.map((name) => caches.delete(name)));

    // Do not claim uncontrolled/new visitors. Snapshot only this worker's windows.
    const windows = await self.clients.matchAll({ type: "window" });
    const unregistered = await self.registration.unregister();
    if (!unregistered) return;

    await Promise.allSettled(windows
      .filter((client) => new URL(client.url).origin === self.location.origin)
      .map((client) => client.navigate(client.url)));
  })());
});

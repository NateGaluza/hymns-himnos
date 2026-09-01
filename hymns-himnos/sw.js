// Minimal service worker. It doesn't cache anything (so you always get the
// latest hymns) — it just exists so the site can be added to your phone's
// home screen as an app.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

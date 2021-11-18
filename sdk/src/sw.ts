import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { skipWaiting, clientsClaim, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
precacheAndRoute(self.__WB_MANIFEST || []);

registerRoute(
  /\.js$/,
  new StaleWhileRevalidate({
    cacheName: 'js-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif)$/,
  new CacheFirst({
    cacheName: 'media-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 120,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  }),
);

const allowedOrigins = [
  'https://unpkg.com',
  'https://cdnjs.cloudflare.com',
  'https://cdn.jsdelivr.net',
];
registerRoute(
  ({ url }) => allowedOrigins.includes(url.origin),
  new CacheFirst({
    cacheName: 'vendor-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 420,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.origin.includes('hub.textile.io') || url.origin.includes('ipfs.infura-ipfs.io'),
  new CacheFirst({
    cacheName: 'ipfs-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 1420,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  }),
);

setCacheNameDetails({
  prefix: 'ewa',
  suffix: 'v0.1.1',
  precache: 'install-time',
  runtime: 'run-time',
  googleAnalytics: 'ga',
});
skipWaiting();
clientsClaim();

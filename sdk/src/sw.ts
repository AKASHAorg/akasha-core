import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { skipWaiting, clientsClaim, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { get, set } from 'idb-keyval';

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

const ENC_KEY = 'ENC_KEY';
const IV_SEPARATOR = '|';
let key;
const genKey = async () => {
  let exportedKey = await get(ENC_KEY);
  if (!exportedKey) {
    const privateKey = await self.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );
    const exportedKeyJWK = await self.crypto.subtle.exportKey('jwk', privateKey);
    exportedKey = JSON.stringify(exportedKeyJWK);
    await set(ENC_KEY, exportedKey);
  }
  key = await self.crypto.subtle.importKey(
    'jwk',
    JSON.parse(exportedKey),
    {
      name: 'AES-GCM',
      length: 256,
    },
    false,
    ['encrypt', 'decrypt'],
  );
};

self.addEventListener('message', async event => {
  if (!event.data.type || !event.data.value || !event.ports?.length) {
    return;
  }
  switch (event.data.type) {
    case 'ENCRYPT_VALUE':
      if (!key) {
        await genKey();
      }
      const iv = self.crypto.getRandomValues(new Uint8Array(16));
      const ciphertext = await self.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        key,
        new TextEncoder().encode(event.data.value),
      );
      event.ports[0].postMessage({ iv: iv.join(IV_SEPARATOR), ciphertext });
      event.ports[0].close();
      break;
    case 'DECRYPT_VALUE':
      if (!event.data?.iv || !event.data?.ciphertext) {
        break;
      }
      if (!key) {
        await genKey();
      }
      const ivArray = Uint8Array.from(event.data.iv.split(IV_SEPARATOR));
      const decrypted = await self.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivArray,
        },
        key,
        event.data.ciphertext,
      );
      const decoded = new TextDecoder().decode(decrypted);
      event.ports[0].postMessage({ value: decoded });
      event.ports[0].close();
      break;
  }
});
skipWaiting();
clientsClaim();

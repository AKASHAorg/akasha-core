import { clientsClaim, setCacheNameDetails } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import {
  //pageCache,
  imageCache,
  staticResourceCache,
  offlineFallback,
} from 'workbox-recipes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
import { get as idbGet, set as idbSet } from 'idb-keyval';
//import { get as idbGet, set as idbSet } from 'idb-keyval/dist/compat';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore

precacheAndRoute(self.__WB_MANIFEST);

// pageCache({ networkTimeoutSeconds: 6 });
staticResourceCache({cacheName: 'static-v1.0'});
imageCache({ maxEntries: 300 });
offlineFallback({ pageFallback: '/img/offline-page.png', imageFallback: '/img/offline-img.png' });
// setCacheNameDetails({
//   prefix: 'akasha',
//   suffix: 'v0.1.0',
//   // precache: 'install-time',
//   // runtime: 'run-time',
//   googleAnalytics: 'ga',
// });
//
// const ENC_KEY = 'ENC_KEY';
// const IV_SEPARATOR = '|';
// let key;
// const genKey = async () => {
//   let exportedKey = await idbGet(ENC_KEY);
//   if (!exportedKey) {
//     const privateKey = await self.crypto.subtle.generateKey(
//       {
//         name: 'AES-GCM',
//         length: 256,
//       },
//       true,
//       ['encrypt', 'decrypt'],
//     );
//     const exportedKeyJWK = await self.crypto.subtle.exportKey('jwk', privateKey);
//     exportedKey = JSON.stringify(exportedKeyJWK);
//     await idbSet(ENC_KEY, exportedKey);
//   }
//   key = await self.crypto.subtle.importKey(
//     'jwk',
//     JSON.parse(exportedKey),
//     {
//       name: 'AES-GCM',
//       length: 256,
//     },
//     false,
//     ['encrypt', 'decrypt'],
//   );
// };
//
// self.addEventListener('message', async event => {
//   if (!event.data.type || !event.ports?.length) {
//     return;
//   }
//   switch (event.data.type) {
//     case 'ENCRYPT_VALUE':
//       if (!key) {
//         await genKey();
//       }
//       if (!event.data.hasOwnProperty('value')) {
//         break;
//       }
//       const iv = self.crypto.getRandomValues(new Uint8Array(16));
//       const ciphertext = await self.crypto.subtle.encrypt(
//         {
//           name: 'AES-GCM',
//           iv: iv,
//         },
//         key,
//         new TextEncoder().encode(event.data.value),
//       );
//       const ciphertextView = new Uint8Array(ciphertext);
//       event.ports[0].postMessage({
//         iv: iv.join(IV_SEPARATOR),
//         ciphertext: ciphertextView.join(IV_SEPARATOR),
//       });
//       event.ports[0].close();
//       break;
//     case 'DECRYPT_VALUE':
//       if (!event.data?.iv || !event.data?.ciphertext) {
//         break;
//       }
//       if (!key) {
//         await genKey();
//       }
//       const ivArray = Uint8Array.from(event.data.iv.split(IV_SEPARATOR));
//       const ciphertextArray = Uint8Array.from(event.data.ciphertext.split(IV_SEPARATOR));
//       const decrypted = await self.crypto.subtle.decrypt(
//         {
//           name: 'AES-GCM',
//           iv: ivArray,
//         },
//         key,
//         ciphertextArray.buffer,
//       );
//       const decoded = new TextDecoder().decode(decrypted);
//       event.ports[0].postMessage({ value: decoded });
//       event.ports[0].close();
//       break;
//   }
// });*/
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
//self.skipWaiting();
clientsClaim();

let worker: Worker;

export const executeOnSW = <T>(payload): Promise<T | null> => {
  if (!worker) {
    worker = new Worker(
      /* webpackIgnore: true */
      new URL('/worker.js', window.location.origin),
      { name: 'ed-worker' },
    );
  }
  const messageChannel = new MessageChannel();
  return new Promise(resolve => {
    // for browsers that don't have the service worker installed
    if (!worker) {
      return resolve(null);
    }
    // in case the sw is stuck or the method is not supported
    const timeout = setTimeout(() => {
      resolve(null);
      messageChannel.port1.close();
    }, 2000);
    // listen for the sw message result
    messageChannel.port1.onmessage = event => {
      resolve(event.data);
      clearTimeout(timeout);
      messageChannel.port1.close();
    };
    // send message to sw to process
    worker.postMessage(payload, [messageChannel.port2]);
  });
};

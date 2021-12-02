export const executeOnSW = payload => {
  const messageChannel = new MessageChannel();
  return new Promise(resolve => {
    // for browsers that don't have the service worker installed
    if (!navigator?.serviceWorker?.controller) {
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
    navigator.serviceWorker.controller.postMessage(payload, [messageChannel.port2]);
  });
};

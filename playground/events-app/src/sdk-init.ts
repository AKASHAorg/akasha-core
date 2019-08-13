import initSdk from '@akashaproject/sdk';

export default function init() {
  const sdk = initSdk();
  // tslint:disable-next-line:no-console
  console.log('[sdk] initialised', sdk);
  // add logic here for setting up configuration before consuming the sdk
  return sdk;
}

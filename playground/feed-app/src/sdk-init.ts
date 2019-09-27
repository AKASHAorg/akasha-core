export default function init() {
  // @ts-ignore
  const sdk = globalThis.AkashaSDK();
  // tslint:disable-next-line:no-console
  console.log('[sdk] initialised', sdk);
  // add logic here for setting up configuration before consuming the sdk
  return sdk;
}

export default function init(appConfig: any, apps: { plugins: any; widgets: any }) {
  // @ts-ignore
  const sdk = globalThis.AkashaSDK({ config: appConfig, initialApps: apps });
  // tslint:disable-next-line:no-console
  console.log('[sdk] initialised', sdk);
  // add logic here for setting up configuration before consuming the sdk
  return sdk;
}

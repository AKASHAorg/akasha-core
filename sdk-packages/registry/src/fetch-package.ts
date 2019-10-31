const installedPackages: string[] = [];
export function loadPackage(url: string, integrity?: string) {
  const preloadPackage: HTMLScriptElement = document.createElement('script');
  preloadPackage.src = url;
  preloadPackage.crossOrigin = 'anonymous';
  preloadPackage.type = 'application/javascript';
  preloadPackage.referrerPolicy = 'no-referrer';
  if (integrity) {
    preloadPackage.integrity = integrity;
  }

  document.body.appendChild(preloadPackage);
}

export async function lookup(domain: string, packageName: string, version: string) {
  // tslint:disable-next-line:no-console
  console.log(domain, packageName, version);
  return { url: 'url', integrity: 'sha256-1238asd' };
}

export async function lookupAndLoad(domain: string, packageName: string, version: string) {
  const packagePath = `${domain}-${packageName}-${version}`;
  if (installedPackages.includes(packagePath)) {
    return;
  }
  const foundPackage = await lookup(domain, packageName, version);
  loadPackage(foundPackage.url, foundPackage.integrity);
  installedPackages.push(packagePath);
}

export async function getLatestVersion(domain: string, packageName: string) {
  // tslint:disable-next-line:no-console
  console.log(domain, packageName);
  return `${packageName}@latest`;
}

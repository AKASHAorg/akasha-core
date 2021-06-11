import { AppRegistryInfo, WidgetRegistryInfo } from '@akashaproject/ui-awf-typings/lib/app-loader';
const importMapMetaElement = document.querySelector('meta[name="importmap-type"]');

export interface ImportMap {
  imports: { [key: string]: string };
  scopes: { [keys: string]: { [key: string]: string } };
}

const importMapType = importMapMetaElement
  ? importMapMetaElement.getAttribute('content')
  : 'importmap';

export const getCurrentImportMaps = () => {
  const scriptEl = document.querySelector(`script[type="${importMapType}"]`);
  if (scriptEl) {
    return scriptEl.textContent;
  }
  return null;
};
export const mergeImportMaps = (oldMap: ImportMap, newMap: ImportMap) => {
  // todo:
  const result: ImportMap = { imports: {}, scopes: {} };
  for (const i in oldMap.imports) {
    result.imports[i] = oldMap.imports[i];
  }
  for (const i in newMap.imports) {
    if (result.imports[i]) {
      continue;
    }
    result.imports[i] = newMap.imports[i];
  }
  for (const i in oldMap.scopes) {
    result.scopes[i] = oldMap.scopes[i];
  }
  for (const i in newMap.scopes) {
    if (result.scopes[i]) {
      continue;
    }
    result.scopes[i] = newMap.scopes[i];
  }
  return result;
};

export const removeImports = () => {
  // todo:
};

export const writeImports = (importsMap: ImportMap, nodeId: string) => {
  const importmapsEl = document.querySelector(`script[type="${importMapType}"]`);
  const scriptEl = document.createElement('script');
  scriptEl.type = `${importMapType}`;
  scriptEl.id = nodeId;
  scriptEl.textContent = JSON.stringify(importsMap, null, 4);

  if (importmapsEl) {
    importmapsEl.insertAdjacentElement('afterend', scriptEl);
  } else {
    document.head.appendChild(scriptEl);
  }
};

export const createImportMap = (integrationInfos: (AppRegistryInfo | WidgetRegistryInfo)[]) => {
  return integrationInfos.reduce(
    (importmap: ImportMap, info) => {
      importmap.imports[info.name] = info.src;
      return importmap;
    },
    { imports: {}, scopes: {} },
  );
};

import { BaseIntegrationInfo } from '@akashaproject/ui-awf-typings/lib/app-loader';
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
    if (oldMap.imports.hasOwnProperty(i)) {
      result.imports[i] = oldMap.imports[i];
    }
  }
  const newMapImports = newMap.imports;
  for (const i in newMapImports) {
    if (newMapImports.hasOwnProperty(i)) {
      if (result.imports[i]) {
        continue;
      }
      result.imports[i] = newMapImports[i];
    }
  }
  const oldMapScopes = oldMap.scopes;
  for (const i in oldMapScopes) {
    if (oldMapScopes.hasOwnProperty(i)) {
      result.scopes[i] = oldMapScopes[i];
    }
  }
  const newMapScopes = newMap.scopes;
  for (const i in newMapScopes) {
    if (newMapScopes.hasOwnProperty(i)) {
      if (result.scopes[i]) {
        continue;
      }
      result.scopes[i] = newMapScopes[i];
    }
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

export const createImportMap = (integrationInfos: BaseIntegrationInfo[]) => {
  return integrationInfos.reduce(
    (importmap: ImportMap, info) => {
      // @TODO: what if there are multiple sources?
      importmap.imports[info.name] = info.sources[0];
      return importmap;
    },
    { imports: {}, scopes: {} },
  );
};

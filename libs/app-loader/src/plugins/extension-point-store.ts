import { ExtensionPointInterface } from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { checkActivity, stringToRegExp } from './utils';

export class ExtensionPointStore {
  static instance: ExtensionPointStore;
  readonly #extensions: (ExtensionPointInterface & { appName: string })[];

  constructor() {
    this.#extensions = [];
  }

  registerExtensionPoint = (extensionPoint: ExtensionPointInterface & { appName: string }) => {
    this.#extensions.push(extensionPoint);
  };

  registerExtensionPoints = (
    extensionPoints: (ExtensionPointInterface & { appName: string })[],
  ) => {
    if (!Array.isArray(extensionPoints)) {
      return;
    }
    extensionPoints.forEach(extensionPoint => this.registerExtensionPoint(extensionPoint));
  };

  getExtensionPoints = () => {
    return this.#extensions;
  };

  getMatchingExtensions = (slotName: string, location: Location) => {
    const matchingExtensions = [];
    for (const ext of this.#extensions) {
      if (stringToRegExp(ext.mountsIn).test(slotName) && !hasOwn(ext, 'activeWhen')) {
        matchingExtensions.push(ext);
      }
      if (stringToRegExp(ext.mountsIn).test(slotName) && typeof ext.activeWhen === 'function') {
        let isActive = checkActivity(ext.activeWhen, location);

        if (Array.isArray(ext.activeWhen) && ext.activeWhen.length > 0) {
          isActive = ext.activeWhen.some(activity => checkActivity(activity, location));
        }

        if (isActive) {
          matchingExtensions.push(ext);
        }
      }
    }
    return matchingExtensions;
  };

  static getInstance() {
    if (!this.instance) {
      this.instance = new ExtensionPointStore();
    }
    return this.instance;
  }
}

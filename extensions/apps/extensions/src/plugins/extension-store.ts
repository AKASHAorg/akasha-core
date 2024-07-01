import {
  ExtensionEvents,
  ExtensionInterface,
  ExtensionRegisterEvent,
  IRootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import { BaseStore } from './base-store';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { pathToActiveWhen } from 'single-spa';
import { stringToRegExp } from './utils';

export class ExtensionStore extends BaseStore {
  static instance: ExtensionStore;
  readonly #extensions: ExtensionInterface[];
  constructor(uiEvents: IRootExtensionProps['uiEvents']) {
    super(uiEvents);
    this.#extensions = [];

    this.subscribeRegisterEvents(ExtensionEvents.RegisterExtension, {
      next: (eventInfo: ExtensionRegisterEvent) => {
        if (!Array.isArray(eventInfo.data)) {
          return;
        }
        this.#extensions.push(...eventInfo.data);
      },
    });
  }

  getExtensions = () => {
    return this.#extensions;
  };

  getMatchingExtensions = (slotName: string, location: Location) => {
    const matchingExtensions = [];
    for (const ext of this.#extensions) {
      if (stringToRegExp(ext.mountsIn).test(slotName) && !hasOwn(ext, 'activeWhen')) {
        matchingExtensions.push(ext);
      }
      if (stringToRegExp(ext.mountsIn).test(slotName) && typeof ext.activeWhen === 'function') {
        const isActive = ext.activeWhen(location, pathToActiveWhen);
        if (isActive) {
          matchingExtensions.push(ext);
        }
      }
    }
    return matchingExtensions;
  };

  static getInstance(uiEvents: IRootExtensionProps<unknown>['uiEvents']) {
    if (!this.instance) {
      this.instance = new ExtensionStore(uiEvents);
    }
    return this.instance;
  }
}

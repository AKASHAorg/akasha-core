import {
  ExtensionActivityFn,
  ExtensionPointEvents,
  ExtensionPointInterface,
  ExtensionPointRegisterEvent,
  IRootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import { BaseStore } from './base-store';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { checkActivity, stringToRegExp } from './utils';

export class ExtensionPointStore extends BaseStore {
  static instance: ExtensionPointStore;
  readonly #extensions: ExtensionPointInterface[];
  constructor(uiEvents: IRootExtensionProps['uiEvents']) {
    super(uiEvents);
    this.#extensions = [];

    this.subscribeRegisterEvents(ExtensionPointEvents.RegisterExtensionPoint, {
      next: (eventInfo: ExtensionPointRegisterEvent) => {
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

  static getInstance(uiEvents: IRootExtensionProps<unknown>['uiEvents']) {
    if (!this.instance) {
      this.instance = new ExtensionPointStore(uiEvents);
    }
    return this.instance;
  }
}

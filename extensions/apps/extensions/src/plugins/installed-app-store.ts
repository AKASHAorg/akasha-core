import { BaseStore } from './base-store';
import { AppEvents, AppRegisterEvent, RootExtensionProps } from '@akashaorg/typings/lib/ui';

export class InstalledAppStore extends BaseStore {
  static instance: InstalledAppStore;
  #apps: AppRegisterEvent['data'][];
  constructor(uiEvents: RootExtensionProps<unknown>['uiEvents']) {
    super(uiEvents);
    this.#apps = [];
    this.subscribeRegisterEvents(AppEvents.RegisterApplication, {
      next: (eventInfo: AppRegisterEvent) => {
        this.#apps.push(eventInfo.data);
      },
    });
  }
  getInstalledApps = () => {
    return this.#apps;
  };
  static getInstance(uiEvents: RootExtensionProps<unknown>['uiEvents']) {
    if (!this.instance) {
      this.instance = new InstalledAppStore(uiEvents);
    }
    return this.instance;
  }
}

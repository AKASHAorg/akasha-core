import { BaseStore } from './base-store';
import {
  IRootComponentProps,
  IRootExtensionProps,
  WidgetEvents,
  WidgetInterface,
  WidgetRegisterEvent,
} from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { checkActivity } from './utils';

export class WidgetStore extends BaseStore {
  static instance: WidgetStore;
  readonly #widgets: (WidgetInterface & { appName: string })[];
  constructor(uiEvents: IRootComponentProps['uiEvents']) {
    super(uiEvents);
    this.#widgets = [];
    this.subscribeRegisterEvents(WidgetEvents.RegisterWidget, {
      next: (eventInfo: WidgetRegisterEvent) => {
        if (eventInfo.data) {
          this.#widgets.push(eventInfo.data);
        }
      },
    });
  }

  getWidgets = () => this.#widgets;

  getMatchingWidgets = (slotName: string, location: Location) => {
    const matchingWidgets = [];
    for (const widget of this.#widgets) {
      if (widget.mountsIn === slotName && !hasOwn(widget, 'activeWhen')) {
        matchingWidgets.push(widget);
      }
      if (widget.mountsIn === slotName && typeof widget.activeWhen === 'function') {
        let isActive = checkActivity(widget.activeWhen, location);

        if (Array.isArray(widget.activeWhen) && widget.activeWhen.length > 0) {
          isActive = widget.activeWhen.some(activity => checkActivity(activity, location));
        }

        if (isActive) {
          matchingWidgets.push(widget);
        }
      }
    }
    return matchingWidgets;
  };
  static getInstance(uiEvents: IRootExtensionProps<unknown>['uiEvents']) {
    if (!this.instance) {
      this.instance = new WidgetStore(uiEvents);
    }
    return this.instance;
  }
}

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
      // CASE 1: activeWhen is not specified, always match
      if (widget.mountsIn === slotName && !hasOwn(widget, 'activeWhen')) {
        matchingWidgets.push(widget);
      }
      // CASE 2: activeWhen is specified as a string
      if (widget.mountsIn === slotName && typeof widget.activeWhen === 'string') {
        if (checkActivity(widget.activeWhen, location)) {
          matchingWidgets.push(widget);
        }
      }
      // CASE 3: activeWhen is specified as an array of strings
      if (widget.mountsIn === slotName && Array.isArray(widget.activeWhen)) {
        // check through the activeWhen values and add widget if there is a match
        widget.activeWhen.forEach(when => {
          if (checkActivity(when, location)) {
            matchingWidgets.push(widget);
          }
        });
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

import { WidgetInterface } from '@akashaorg/typings/lib/ui';
import { checkActivity } from './utils';

export class WidgetStore {
  static instance: WidgetStore;
  readonly #widgets: (WidgetInterface & { appName: string })[];
  #widgetRemoveCallbacks: Map<string, (() => void)[]>;
  constructor() {
    this.#widgets = [];
    this.#widgetRemoveCallbacks = new Map();
  }

  registerWidget(widget: WidgetInterface & { appName: string }) {
    this.#widgets.push(widget);
  }

  onWidgetUnload(widgetName: string, cb: () => void) {
    if (this.#widgetRemoveCallbacks.has(widgetName)) {
      this.#widgetRemoveCallbacks.set(widgetName, [
        ...this.#widgetRemoveCallbacks.get(widgetName),
        cb,
      ]);
    } else {
      this.#widgetRemoveCallbacks.set(widgetName, [cb]);
    }
  }

  unregisterWidget(widgetName: string) {
    const removedWidget =
      this.#widgets.splice(
        this.#widgets.findIndex(({ appName }) => appName === widgetName),
        1,
      )[0] ?? null;

    if (removedWidget) {
      this.#widgetRemoveCallbacks.get(widgetName)?.forEach(cb => cb());
    }
  }

  getWidgets = () => this.#widgets;

  getMatchingWidgets = (slotName: string, location: Location) => {
    const matchingWidgets = [];
    for (const widget of this.#widgets) {
      if (widget.mountsIn === slotName && widget.activeWhen === undefined) {
        matchingWidgets.push(widget);
        continue;
      }
      let isActive = false;

      if (widget.mountsIn !== slotName) {
        continue;
      }

      if (Array.isArray(widget.activeWhen) && widget.activeWhen.length > 0) {
        isActive = widget.activeWhen.some(activity => checkActivity(activity, location));
      }

      if (typeof widget.activeWhen === 'function' || typeof widget.activeWhen === 'string') {
        isActive = checkActivity(widget.activeWhen, location);
      }

      if (isActive) {
        matchingWidgets.push(widget);
      }
    }
    return matchingWidgets;
  };
  static getInstance() {
    if (!this.instance) {
      this.instance = new WidgetStore();
    }
    return this.instance;
  }
}

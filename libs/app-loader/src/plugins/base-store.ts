import { Observer, Subscription } from 'rxjs';
import { IRootExtensionProps, UIEventData } from '@akashaorg/typings/lib/ui';
import { filterEvent } from '@akashaorg/ui-awf-hooks';

export class BaseStore {
  #uiEvents: IRootExtensionProps<unknown>['uiEvents'];
  #uiEventsSub: Subscription;
  constructor(uiEvents: IRootExtensionProps['uiEvents']) {
    this.#uiEvents = uiEvents;
  }

  unsubscribeRegisterEvents = () => {
    if (this.#uiEventsSub) {
      this.#uiEventsSub.unsubscribe();
    }
  };

  subscribeRegisterEvents = (
    eventName: UIEventData['event'],
    subscription: Partial<Observer<UIEventData>>,
  ) => {
    if (this.#uiEventsSub) {
      this.#uiEventsSub.unsubscribe();
      this.#uiEventsSub = null;
    }
    this.#uiEventsSub = this.#uiEvents.pipe(filterEvent(eventName)).subscribe(subscription);
  };
}

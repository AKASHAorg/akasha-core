import {
  ContentBlockEvents,
  ContentBlockRegisterEvent,
  RootComponentProps,
  RootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import { filterEvent } from '@akashaorg/ui-awf-hooks';
import { Subscription } from 'rxjs';

export class ContentBlockStore {
  static instance: ContentBlockStore;
  private blocks: ContentBlockRegisterEvent['data'];
  uiEventsSub: Subscription;
  uiEvents: RootComponentProps['uiEvents'];

  constructor(uiEvents) {
    this.uiEvents = uiEvents;
    this.blocks = [];
    this.listenRegisterEvents();
  }

  public getMatchingBlocks = (appName: string, propertyType: string) => {
    // todo:
    return this.blocks.filter(
      block => block.propertyType === propertyType && block.appName === appName,
    );
  };

  public getContentBlockInfos = () => {
    return this.blocks.map(cblock => {
      const { loadingFn, ...info } = cblock;
      return info;
    });
  };
  private listenRegisterEvents = () => {
    if (this.uiEventsSub) {
      this.uiEventsSub.unsubscribe();
      this.uiEventsSub = null;
    }
    this.uiEventsSub = this.uiEvents
      .pipe(filterEvent(ContentBlockEvents.RegisterContentBlock))
      .subscribe({
        next: (event: ContentBlockRegisterEvent) => {
          if (!Array.isArray(event.data)) {
            return;
          }
          this.blocks.push(...event.data);
        },
      });
  };

  static getInstance(uiEvents: RootExtensionProps['uiEvents']) {
    if (!this.instance) {
      this.instance = new ContentBlockStore(uiEvents);
    }
    return this.instance;
  }
}

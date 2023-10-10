import {
  ContentBlockEvents,
  ContentBlockRegisterEvent,
  ContentBlockStorePluginInterface,
  RootComponentProps,
  RootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import { filterEvent, hasOwn } from '@akashaorg/ui-awf-hooks';
import { Subscription } from 'rxjs';
import { AkashaContentBlockLabeledValue } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export class ContentBlockStore {
  static instance: ContentBlockStore;
  #blocks: ContentBlockRegisterEvent['data'];
  #uiEventsSub: Subscription;
  #uiEvents: RootComponentProps['uiEvents'];

  constructor(uiEvents: RootComponentProps['uiEvents']) {
    this.#uiEvents = uiEvents;
    this.#blocks = [];
    this.listenRegisterEvents();
  }

  public getMatchingBlocks: ContentBlockStorePluginInterface['getMatchingBlocks'] = blockInfo => {
    if (!blockInfo) {
      console.warn('Block info not defined:', blockInfo);
      return [];
    }
    if (hasOwn(blockInfo, 'propertyType') && hasOwn(blockInfo, 'appName')) {
      const blocks = this.#blocks
        .map(block => {
          if (
            block.propertyType === blockInfo.propertyType &&
            block.appName === blockInfo.appName
          ) {
            return {
              blockInfo: block,
            };
          }
        })
        .filter(Boolean);
      if (blocks.length > 1) {
        console.error(
          'Found multiple blocks for the same app. This is currently not supported',
          blockInfo.appName,
          blocks.map(b => b.blockInfo.displayName),
        );
      }
      if (blocks.length < 1) {
        console.error(
          'The app',
          blockInfo.appName,
          'does not have a block matching',
          blockInfo.propertyType,
        );
        return [];
      }
      return blocks;
    } else {
      if (
        hasOwn(blockInfo, 'appVersion') &&
        hasOwn(blockInfo.appVersion, 'application') &&
        hasOwn(blockInfo.appVersion.application, 'name') &&
        hasOwn(blockInfo, 'content') &&
        Array.isArray(blockInfo.content)
      ) {
        let applicationName = blockInfo.appVersion.application.name;
        // @TODO: remove this if statement
        if (applicationName === 'Beams-Test') {
          applicationName = '@akashaorg/app-akasha-integration';
        }
        if (!applicationName) {
          console.error('Application name is not defined! blockInfo', blockInfo);
          return [];
        }
        return this.#blocks
          .filter(bl => bl.appName === applicationName)
          .flatMap(blockExt => {
            return (blockInfo.content as AkashaContentBlockLabeledValue[])
              .filter(content => content.propertyType === blockExt.propertyType)
              .map(content => ({
                blockInfo: blockExt,
                blockData: blockInfo,
                content,
              }));
          })
          .filter(Boolean);
      }
    }
  };

  public getContentBlockInfos = () => {
    return this.#blocks.map(cblock => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { loadingFn, ...info } = cblock;
      return info;
    });
  };
  private listenRegisterEvents = () => {
    if (this.#uiEventsSub) {
      this.#uiEventsSub.unsubscribe();
      this.#uiEventsSub = null;
    }
    this.#uiEventsSub = this.#uiEvents
      .pipe(filterEvent(ContentBlockEvents.RegisterContentBlock))
      .subscribe({
        next: (event: ContentBlockRegisterEvent) => {
          if (!Array.isArray(event.data)) {
            return;
          }
          this.#blocks.push(...event.data);
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

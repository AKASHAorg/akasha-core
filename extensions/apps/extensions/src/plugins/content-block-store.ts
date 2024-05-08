import {
  ContentBlockEvents,
  ContentBlockRegisterEvent,
  ContentBlockStorePluginInterface,
  RootComponentProps,
  RootExtensionProps,
} from '@akashaorg/typings/lib/ui';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { AkashaContentBlockLabeledValue } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { BaseStore } from './base-store';

/**
 * When app-loader loads the applications config (the return object of the register function);
 * it checks if the config has the 'contentBlocks' property.
 * if it does, it will emit the 'ContentBlockEvents.RegisterContentBlock' event.
 *
 * This class ContentBlockStore listens for this event and stores the received data into the blocks property (this.#blocks).
 *
 * The getMatchingBlocks method takes as param, 'blockInfo', iterates over the blocks and tries to find the block(s)  matching the 'propertyType' and the 'appName' of the passed 'blockInfo'
 */
export class ContentBlockStore extends BaseStore {
  static instance: ContentBlockStore;
  #blocks: ContentBlockRegisterEvent['data'];

  constructor(uiEvents: RootComponentProps['uiEvents']) {
    super(uiEvents);
    this.#blocks = [];
    this.subscribeRegisterEvents(ContentBlockEvents.RegisterContentBlock, {
      next: (eventInfo: ContentBlockRegisterEvent) => {
        if (!Array.isArray(eventInfo.data)) {
          return;
        }
        this.#blocks.push(...eventInfo.data);
      },
    });
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
        if (applicationName === 'antenna-test') {
          applicationName = '@akashaorg/app-antenna';
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

  static getInstance(uiEvents: RootExtensionProps<unknown>['uiEvents']) {
    if (!this.instance) {
      this.instance = new ContentBlockStore(uiEvents);
    }
    return this.instance;
  }
}

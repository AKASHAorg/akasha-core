import {
  ContentBlockConfig,
  IContentBlockStorePlugin,
  LocalContentBlock,
} from '@akashaorg/typings/lib/ui';
import { BlockLabeledValue } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { FilterEmpty } from '../type-utils';

const isLocalBlock = (
  blockInfo: LocalContentBlock | GetContentBlockByIdQuery['node'],
): blockInfo is LocalContentBlock => {
  return 'appName' in blockInfo && 'propertyType' in blockInfo;
};

const isNotEmpty = (
  blockInfo: GetContentBlockByIdQuery['node'],
): blockInfo is FilterEmpty<GetContentBlockByIdQuery['node']> => {
  return Object.keys(blockInfo).length > 0;
};
/**
 * When app-loader loads the applications config (the return object of the register function);
 * it checks if the config has the 'contentBlocks' property.
 * if it does, it will emit the 'ContentBlockEvents.RegisterContentBlock' event.
 *
 * This class ContentBlockStore listens for this event and stores the received data into the blocks property (this.#blocks).
 *
 * The getMatchingBlocks method takes as param, 'blockInfo', iterates over the blocks and tries to find the block(s)  matching the 'propertyType' and the 'appName' of the passed 'blockInfo'
 */
export class ContentBlockStore {
  static instance: ContentBlockStore;
  #blocks: (ContentBlockConfig & { appName: string })[];
  constructor() {
    this.#blocks = [];
  }

  public registerContentBlock = (blockInfo: ContentBlockConfig & { appName: string }) => {
    this.#blocks.push(blockInfo);
  };

  public registerContentBlocks = (blockInfos: (ContentBlockConfig & { appName: string })[]) => {
    if (!Array.isArray(blockInfos)) {
      return;
    }
    blockInfos.forEach(blockInfo => {
      this.registerContentBlock(blockInfo);
    });
  };

  public getMatchingBlocks: IContentBlockStorePlugin['getMatchingBlocks'] = blockInfo => {
    if (!blockInfo) {
      console.warn('Block info not defined:', blockInfo);
      return [];
    }
    if (isLocalBlock(blockInfo)) {
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
      if (isNotEmpty(blockInfo)) {
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
            return (blockInfo.content as BlockLabeledValue[])
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

  public getInfos = () => {
    return this.#blocks.map(cblock => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { loadingFn, ...info } = cblock;
      return info;
    });
  };

  static getInstance() {
    if (!this.instance) {
      this.instance = new ContentBlockStore();
    }
    return this.instance;
  }
}

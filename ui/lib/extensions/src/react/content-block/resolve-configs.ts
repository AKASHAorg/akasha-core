import getSDK from '@akashaorg/awf-sdk';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { MatchingBlock } from './common.types';
import { hasOwn } from '@akashaorg/ui-awf-hooks';

interface IResolveConfigs {
  matchingBlocks: MatchingBlock[];
  mode: ContentBlockModes;
}

const sdk = getSDK();
const uiStash = sdk.services.stash.getUiStash();

export const resolveConfigs = async ({ matchingBlocks, mode }: IResolveConfigs) => {
  const newBlocks = [];
  for (const block of matchingBlocks) {
    let id = null;
    if (block?.blockData && hasOwn(block.blockData, 'id')) {
      id = `${block.blockInfo.appName}-${block.blockData.id}`;
    }
    if (!uiStash.has(id)) {
      const config = await block.blockInfo.loadingFn({
        blockInfo: { ...block.blockInfo, mode },
        blockData: block.blockData,
      })();
      uiStash.set(id, config);
    }
    const config = uiStash.get(id);
    newBlocks.push({ ...block, config });
  }
  return newBlocks;
};

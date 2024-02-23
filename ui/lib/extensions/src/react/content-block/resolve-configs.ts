import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { MatchingBlock } from './common.types';

interface IResolveConfigs {
  matchingBlocks: MatchingBlock[];
  mode: ContentBlockModes;
}

export const resolveConfigs = async ({ matchingBlocks, mode }: IResolveConfigs) => {
  const newBlocks = [];
  for (const block of matchingBlocks) {
    try {
      const config = await block.blockInfo.loadingFn({
        blockInfo: { ...block.blockInfo, mode },
        blockData: block.blockData,
      })();
      newBlocks.push({ ...block, config });
    } catch (err) {
      console.error(err);
    }
  }
  return newBlocks;
};

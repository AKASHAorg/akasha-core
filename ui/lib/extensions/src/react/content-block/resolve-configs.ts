import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { MatchingBlock } from './common.types';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';

interface IResolveConfigs {
  matchingBlocks: MatchingBlock[];
  mode: ContentBlockModes;
  logger: ILogger;
}

export const resolveConfigs = async ({ matchingBlocks, mode, logger }: IResolveConfigs) => {
  const newBlocks = [];
  for (const block of matchingBlocks) {
    try {
      const config = await block.blockInfo.loadingFn({
        blockInfo: { ...block.blockInfo, mode },
        blockData: block.blockData,
      })();
      newBlocks.push({ ...block, config });
    } catch (err) {
      logger.error(err);
    }
  }
  return newBlocks;
};

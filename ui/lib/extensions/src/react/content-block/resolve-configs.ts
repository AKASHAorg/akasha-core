import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { MatchingBlock } from './common.types';
import { ILogger } from '@akashaorg/typings/lib/sdk/log';
import { hasOwn } from '@akashaorg/ui-awf-hooks';

interface IResolveConfigs {
  matchingBlocks: MatchingBlock[];
  mode: ContentBlockModes;
  logger: ILogger;
}

const MAX_CACHE_SIZE = 100;

const blocksConfigCache = new Map();

export const resolveConfigs = async ({ matchingBlocks, mode, logger }: IResolveConfigs) => {
  const newBlocks = [];
  for (const block of matchingBlocks) {
    try {
      let id = null;
      if (block?.blockData && hasOwn(block.blockData, 'id')) {
        id = block.blockData.id;
      }
      if (!blocksConfigCache.has(id)) {
        const config = await block.blockInfo.loadingFn({
          blockInfo: { ...block.blockInfo, mode },
          blockData: block.blockData,
        })();
        addToCache(id, config);
      }
      const config = blocksConfigCache.get(id);
      newBlocks.push({ ...block, config });
    } catch (err) {
      logger.error('content block resolveConfigs function', err);
    }
  }
  return newBlocks;
};

function addToCache(key: string, value: unknown) {
  if (blocksConfigCache.size >= MAX_CACHE_SIZE) {
    const firstKey = blocksConfigCache.keys().next().value;
    if (firstKey) blocksConfigCache.delete(firstKey);
  }
  blocksConfigCache.set(key, value);
}

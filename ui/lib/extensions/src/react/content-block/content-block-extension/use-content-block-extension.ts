import { useEffect, useLayoutEffect, useState } from 'react';
import { ParcelConfigObject } from 'single-spa';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { resolveConfigs } from '../resolve-configs';
import { MatchingBlock } from '../common.types';

/**
 * This hook exports basic method and state values specific to content block extension
 */
export function useContentBlockExtension({
  matchingBlocks,
  cacheBlockConfig,
  blockInfoQuery: { called, loading },
}) {
  const [hasContentLoadError, setHasContentLoadError] = useState(false);
  const [state, setState] = useState<{
    parcels: (MatchingBlock & { config: ParcelConfigObject })[];
    isMatched: boolean;
  }>({
    parcels: [],
    isMatched: false,
  });
  const { logger } = useRootComponentProps();
  useEffect(() => {
    return () => {
      setState({
        isMatched: false,
        parcels: [],
      });
    };
  }, []);
  useLayoutEffect(() => {
    if (
      matchingBlocks &&
      matchingBlocks.length &&
      matchingBlocks.length !== state.parcels.length &&
      !state.isMatched
    ) {
      resolveConfigs({ matchingBlocks, mode: ContentBlockModes.READONLY, cache: cacheBlockConfig })
        .then(newBlocks => {
          setState({
            parcels: newBlocks,
            isMatched: true,
          });
        })
        .catch(err => {
          setHasContentLoadError(true);
          logger.error('failed to load content blocks', err);
        });
    } else if (matchingBlocks && !matchingBlocks.length && !state.isMatched && called && !loading) {
      setState({
        parcels: [],
        isMatched: true,
      });
    }
  }, [state, logger, called, loading, matchingBlocks, cacheBlockConfig]);

  return { state, hasContentLoadError };
}

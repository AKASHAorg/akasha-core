import React, { useEffect, useMemo, useRef } from 'react';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { BlockInstanceMethods } from '@akashaorg/typings/lib/ui';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { useGetContentBlockByIdLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { BlockError } from '../block-error-card';
import { MatchingBlock } from '../common.types';
import { RenderError } from './render-error';
import { RenderBlock } from './render-block';
import { useContentBlockExtension } from './use-content-block-extension';

export type ContentBlockExtensionProps = {
  blockRef?: React.RefObject<BlockInstanceMethods>;
  fetchError?: BlockError;
  contentLoadError?: BlockError;
  installButtonLabel: string;
  notInstalledTitle: string;
  notInstalledDescription1: string;
  notInstalledDescription2: string;
  // cache to prevent re-loading block config with the same block id
  cacheBlockConfig?: boolean;
  onError?: (error: Error) => void;
} & (
  | {
      blockID: string;
    }
  | {
      blockData: GetContentBlockByIdQuery['node'];
      matchingBlocks?: MatchingBlock[];
      error?: string;
      refreshLabel?: string;
      onRefresh?: () => void;
    }
);

export const ContentBlockExtension: React.FC<ContentBlockExtensionProps> = props => {
  const {
    blockRef,
    fetchError,
    contentLoadError,
    installButtonLabel,
    notInstalledTitle,
    notInstalledDescription1,
    notInstalledDescription2,
    cacheBlockConfig,
    onError,
    ...remainingProps
  } = props;
  const { logger, getExtensionsPlugin } = useRootComponentProps();
  const contentBlockStoreRef = useRef(getExtensionsPlugin()?.contentBlockStore);
  const [fetchBlockInfo, blockInfoQuery] = useGetContentBlockByIdLazyQuery();
  /**
   * remainingProps could have either just the blockID or other necessary data passed from the parent
   * Each of the variables and hooks below evaluates the props available in the remainingProps and acts accordingly.
   */
  // if only blockID, fetch the necessary data
  useEffect(() => {
    if (hasOwn(remainingProps, 'blockID')) {
      fetchBlockInfo({
        variables: {
          id: remainingProps.blockID,
        },
      }).catch(err => logger.error(`failed to fetch content block: ${JSON.stringify(err)}`));
    }
  }, [logger, fetchBlockInfo, remainingProps]);
  // fetch data error
  const fetchDataError = useMemo(() => {
    return hasOwn(remainingProps, 'error') ? remainingProps?.error : blockInfoQuery.error?.message;
  }, [remainingProps, blockInfoQuery]);
  // block data
  const blockData = useMemo(() => {
    if (hasOwn(remainingProps, 'blockData') && hasOwn(remainingProps.blockData, 'id')) {
      return remainingProps.blockData;
    }
    if (blockInfoQuery.data?.node && hasOwn(blockInfoQuery.data?.node, 'id')) {
      return blockInfoQuery.data?.node;
    }
    return null;
  }, [blockInfoQuery.data?.node, remainingProps]);
  // find matching blocks
  const matchingBlocks: MatchingBlock[] = useMemo(() => {
    if (hasOwn(remainingProps, 'matchingBlocks') && remainingProps?.matchingBlocks)
      return remainingProps.matchingBlocks;
    return !blockData ? [] : contentBlockStoreRef.current.getMatchingBlocks(blockData);
  }, [blockData, remainingProps]);
  const { state, hasContentLoadError } = useContentBlockExtension({
    matchingBlocks,
    cacheBlockConfig,
    blockInfoQuery,
  });
  const appInfo = useMemo(() => {
    if (blockData) {
      return blockData.appVersion?.application;
    }
  }, [blockData]);

  if (hasContentLoadError || fetchDataError) {
    return (
      <RenderError
        fetchError={fetchError}
        contentLoadError={contentLoadError}
        fetchDataError={fetchDataError}
        hasContentLoadError={hasContentLoadError}
        refreshLabel={hasOwn(remainingProps, 'refreshLabel') ? remainingProps.refreshLabel : ''}
        handleRefresh={() => {
          if (hasOwn(remainingProps, 'blockID')) {
            blockInfoQuery.refetch({
              id: remainingProps?.blockID,
            });
          }

          if (hasOwn(remainingProps, 'blockData')) {
            remainingProps.onRefresh?.();
          }
        }}
      />
    );
  }

  return (
    <RenderBlock
      state={state}
      appInfo={appInfo}
      blockId={blockData?.id}
      blockRef={blockRef}
      notInstalledTitle={notInstalledTitle}
      installButtonLabel={installButtonLabel}
      notInstalledDescription1={notInstalledDescription1}
      notInstalledDescription2={notInstalledDescription2}
      onError={onError}
    />
  );
};

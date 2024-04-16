import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ContentBlockModes, BlockInstanceMethods } from '@akashaorg/typings/lib/ui';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { useGetContentBlockByIdLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { ParcelConfigObject } from 'single-spa';
import { BlockParcel } from './block-parcel';
import { MatchingBlock } from './common.types';
import { resolveConfigs } from './resolve-configs';
import { BlockError, BlockErrorCard } from './block-error-card';

export type ContentBlockExtensionProps = {
  blockRef?: React.RefObject<BlockInstanceMethods>;
  fetchError?: BlockError;
  contentLoadError?: BlockError;
  notInstalledTitle: string;
  notInstalledDescription1: string;
  notInstalledDescription2: string;
  //Cache to prevent re-loading block config with the same block id
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
    notInstalledTitle,
    notInstalledDescription1,
    notInstalledDescription2,
    cacheBlockConfig,
    onError,
    ...remainingProps
  } = props;
  const { logger, getExtensionsPlugin } = useRootComponentProps();
  const contentBlockStoreRef = useRef(getExtensionsPlugin()?.contentBlockStore);
  const [hasContentLoadError, setHasContentLoadError] = useState(false);
  const [state, setState] = useState<{
    parcels: (MatchingBlock & { config: ParcelConfigObject })[];
    isMatched: boolean;
  }>({
    parcels: [],
    isMatched: false,
  });
  const [fetchBlockInfo, blockInfoQuery] = useGetContentBlockByIdLazyQuery();
  const fetchDataError = useMemo(() => {
    return hasOwn(remainingProps, 'blockData')
      ? remainingProps?.error
      : blockInfoQuery.error?.message;
  }, [remainingProps, blockInfoQuery]);
  const blockData = useMemo(() => {
    if (hasOwn(remainingProps, 'blockData')) {
      if (remainingProps.blockData && hasOwn(remainingProps.blockData, 'id')) {
        return remainingProps.blockData;
      }
    }
    if (blockInfoQuery.data?.node && hasOwn(blockInfoQuery.data?.node, 'id')) {
      return blockInfoQuery.data?.node;
    }
    return null;
  }, [remainingProps, blockInfoQuery]);
  const matchingBlocks: MatchingBlock[] = useMemo(() => {
    if (hasOwn(remainingProps, 'blockData') && remainingProps?.matchingBlocks)
      return remainingProps.matchingBlocks;
    return !blockData ? [] : contentBlockStoreRef.current.getMatchingBlocks(blockData);
  }, [blockData, remainingProps]);

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
    } else if (
      matchingBlocks &&
      !matchingBlocks.length &&
      !state.isMatched &&
      blockInfoQuery.called &&
      !blockInfoQuery.loading
    ) {
      setState({
        parcels: [],
        isMatched: true,
      });
    }
  }, [logger, blockInfoQuery.called, blockInfoQuery.loading, matchingBlocks, state]);

  useEffect(() => {
    if (hasOwn(remainingProps, 'blockID')) {
      fetchBlockInfo({
        variables: {
          id: remainingProps.blockID,
        },
      }).catch(err => logger.error(`failed to fetch content block: ${JSON.stringify(err)}`));
    }
  }, [logger, fetchBlockInfo, remainingProps]);

  useEffect(() => {
    return () => {
      setState({
        isMatched: false,
        parcels: [],
      });
    };
  }, []);

  const appInfo = useMemo(() => {
    if (blockData) {
      return blockData.appVersion?.application;
    }
  }, [blockData]);

  if (hasContentLoadError || fetchDataError) {
    return (
      <Stack spacing="gap-y-2">
        {hasContentLoadError && (
          <BlockErrorCard
            errorTitle={contentLoadError.errorTitle}
            errorDescription={contentLoadError.errorDescription}
          />
        )}
        {fetchDataError && (
          <BlockErrorCard
            errorTitle={fetchError.errorTitle}
            errorDescription={fetchError.errorDescription}
            refreshLabel={hasOwn(remainingProps, 'blockData') ? remainingProps.refreshLabel : ''}
            onRefresh={() => {
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
        )}
      </Stack>
    );
  }

  return (
    <>
      {!state.parcels.length && !state.isMatched && (
        <Stack fullWidth={true} spacing="gap-y-1" customStyle="mb-2">
          <TextLine width="w-full" animated />
          <TextLine width="w-2/3" animated />
        </Stack>
      )}
      {!state.parcels.length && state.isMatched && appInfo && (
        <Stack
          spacing="gap-y-2"
          padding="p-4"
          background={{ light: 'grey9', dark: 'grey1' }}
          customStyle="rounded-[20px]"
        >
          <Stack direction="row" spacing="gap-x-1">
            <Text variant="button-sm">
              {appInfo.displayName} {notInstalledTitle}
            </Text>
            <Button variant="text" label={'Install'} customStyle="ml-auto" />
          </Stack>
          <Text variant="footnotes2" weight="normal">
            {notInstalledDescription1} {appInfo.displayName} {notInstalledDescription2}
          </Text>
        </Stack>
      )}
      {state.parcels.map((matchingBlock, index) => {
        return (
          <BlockParcel
            key={index}
            mode={ContentBlockModes.READONLY}
            matchingBlock={matchingBlock}
            blockId={blockData?.id}
            index={index}
            blockRef={blockRef}
            onError={onError}
          />
        );
      })}
    </>
  );
};

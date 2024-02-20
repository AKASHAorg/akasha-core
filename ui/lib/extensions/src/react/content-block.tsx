import React, { ReactElement, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  type BlockInstanceMethods,
  type ContentBlockExtensionInterface,
  ContentBlockModes,
} from '@akashaorg/typings/lib/ui';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ParcelConfigObject } from 'single-spa';
import { useGetContentBlockByIdLazyQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { RootParcel } from './root-parcel';

export type MatchingBlock = {
  blockInfo: ContentBlockExtensionInterface & {
    appName: string;
  };
  blockData?: GetContentBlockByIdQuery['node'];
  content?: unknown;
};

export type ContentBlockExtensionProps = {
  mode: ContentBlockModes;
  editMode?: {
    propertyType: string;
    appName: string;
    externalHandler?: (value: never) => void;
  };
  readMode?: {
    blockID: string;
  };
  blockRef?: React.RefObject<BlockInstanceMethods>;
  hideContent?: boolean;
  children?: (props: {
    blockData: MatchingBlock['blockData'];
    blockInfo: MatchingBlock['blockInfo'];
  }) => ReactElement;
  onError?: (error: Error) => void;
};

export const ContentBlockExtension = (props: ContentBlockExtensionProps) => {
  const { blockRef, mode, editMode, readMode, onError, hideContent, children } = props;
  const { getExtensionsPlugin, getContext, logger } = useRootComponentProps();
  const contentBlockStoreRef = React.useRef(getExtensionsPlugin()?.contentBlockStore);
  const [state, setState] = React.useState<{
    parcels: (MatchingBlock & { config: ParcelConfigObject })[];
    isMatched: boolean;
  }>({
    parcels: [],
    isMatched: false,
  });

  useLayoutEffect(() => {
    if (!contentBlockStoreRef.current && !!getExtensionsPlugin()) {
      contentBlockStoreRef.current = getExtensionsPlugin().contentBlockStore;
    }
  }, [getExtensionsPlugin]);

  const [fetchBlockInfo, blockInfoQuery] = useGetContentBlockByIdLazyQuery();

  useEffect(() => {
    if (readMode?.blockID) {
      fetchBlockInfo({
        variables: {
          id: readMode?.blockID,
        },
      }).catch(err => console.error('Failed to fetch content block. Error', err));
    }
  }, [fetchBlockInfo, readMode?.blockID]);

  useEffect(() => {
    return () => {
      setState({
        isMatched: false,
        parcels: [],
      });
    };
  }, []);

  const matchingBlocks: MatchingBlock[] = useMemo(() => {
    if (!contentBlockStoreRef.current) return [];
    switch (mode) {
      case ContentBlockModes.EDIT:
        return contentBlockStoreRef.current.getMatchingBlocks({
          appName: editMode.appName,
          propertyType: editMode.propertyType,
        });
      case ContentBlockModes.READONLY:
        if (!blockInfoQuery.data?.node) return [];
        return contentBlockStoreRef.current.getMatchingBlocks(blockInfoQuery.data.node);
      default:
        return [];
    }
  }, [mode, editMode, blockInfoQuery.data]);

  useLayoutEffect(() => {
    const resolveConfigs = async () => {
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

      setState({
        parcels: newBlocks,
        isMatched: true,
      });
    };

    if (
      matchingBlocks &&
      matchingBlocks.length &&
      matchingBlocks.length !== state.parcels.length &&
      !state.isMatched
    ) {
      resolveConfigs().catch(err => console.error('failed to load content blocks', err));
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
  }, [blockInfoQuery.called, blockInfoQuery.loading, matchingBlocks, mode, state]);

  const appInfo = useMemo(() => {
    if (blockInfoQuery.called && !blockInfoQuery.loading) {
      if (
        blockInfoQuery.data?.node &&
        hasOwn(blockInfoQuery.data.node, 'appVersion') &&
        blockInfoQuery.data.node.appVersion?.application
      ) {
        return blockInfoQuery.data.node.appVersion.application;
      }
    }
  }, [blockInfoQuery]);

  const handleParcelError = React.useCallback(
    (parcelName: string) => {
      return error => {
        if (logger) logger.error(`error in parcel ${parcelName}: ${error}`);
        onError?.(error);
      };
    },
    [logger, onError],
  );
  
  const blockId = React.useMemo(() => {
    return readMode?.blockID ?? 0;
  }, [readMode]);
  
  return (
    <React.Suspense
      fallback={
        <Stack fullWidth={true} spacing="gap-y-1" customStyle="mb-2">
          <TextLine animated={true} width="w-full" />
          <TextLine animated={true} width="w-2/3" />
        </Stack>
      }
    >
      {blockInfoQuery.error && (
        <Stack
          fullWidth={true}
          spacing="gap-y-1"
          customStyle="my-2 gap-2 items-center"
          direction="row"
        >
          <Icon icon={<ExclamationTriangleIcon />} />
          <Text variant="footnotes1">Ouch, there was an error when loading the content.</Text>
        </Stack>
      )}
      {!state.parcels.length && !state.isMatched && (
        <Stack fullWidth={true} spacing="gap-y-1" customStyle="mb-2">
          <TextLine animated={true} width="w-full" />
          <TextLine animated={true} width="w-2/3" />
        </Stack>
      )}
      {!state.parcels.length && state.isMatched && appInfo && (
        <Stack fullWidth={true} customStyle="min-w-full" spacing="gap-y-1" padding="py-2">
          <Stack
            direction="row"
            fullWidth={true}
            justify="between"
            align="center"
            customStyle="min-w-full"
          >
            <Stack direction="column">
              <Text variant="button-sm">App not installed</Text>
              <Text variant="footnotes2" weight="normal">
                You need to install {appInfo.displayName} to see this content
              </Text>
            </Stack>
            <Stack>
              <Button label={'Install'} />
            </Stack>
          </Stack>
        </Stack>
      )}
      {state.parcels.map((matchingBlock, index) => {
        return (
          <Stack
            fullWidth
            id={`${mode}_${matchingBlock.blockInfo.propertyType}_${blockId}_${index}`}
            key={`${mode}_${matchingBlock.blockInfo.propertyType}_${blockId}_${index}`}
          >
            {!hideContent && (
              <RootParcel
                config={{
                  ...matchingBlock.config,
                  name: `${matchingBlock.blockInfo.appName}_${matchingBlock.blockInfo.propertyType}_${blockId}_${index}`,
                }}
                {...getContext()}
                blockInfo={{
                  ...matchingBlock.blockInfo,
                  mode,
                  externalHandler: editMode?.externalHandler,
                }}
                blockData={matchingBlock.blockData}
                blockRef={blockRef}
                content={matchingBlock.content}
                handleError={handleParcelError(
                  `${matchingBlock.blockInfo.appName}_${matchingBlock.blockInfo.propertyType}_${blockId}_${index}`,
                )}
              />
            )}

            {children?.({
              blockData: matchingBlock.blockData,
              blockInfo: matchingBlock.blockInfo,
            })}
          </Stack>
        );
      })}
    </React.Suspense>
  );
};

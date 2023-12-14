import * as React from 'react';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Parcel from 'single-spa-react/parcel';
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
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';

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
  };
  readMode?: {
    blockID: string;
  };
  blockRef?: React.RefObject<BlockInstanceMethods>;
};

export const ContentBlockExtension = (props: ContentBlockExtensionProps) => {
  const { blockRef, mode, editMode, readMode } = props;
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const contentBlockStoreRef = React.useRef(getExtensionsPlugin()?.contentBlockStore);
  const [state, setState] = React.useState<{
    parcels: (MatchingBlock & { config: ParcelConfigObject })[];
    isMatched: boolean;
  }>({
    parcels: [],
    isMatched: false,
  });

  React.useLayoutEffect(() => {
    if (!contentBlockStoreRef.current && !!getExtensionsPlugin()) {
      contentBlockStoreRef.current = getExtensionsPlugin().contentBlockStore;
    }
  }, [getExtensionsPlugin]);

  const [fetchBlockInfo, blockInfoQuery] = useGetContentBlockByIdLazyQuery();

  React.useEffect(() => {
    if (readMode?.blockID) {
      fetchBlockInfo({
        variables: {
          id: readMode?.blockID,
        },
      }).catch(err => console.error(err, '<< failed to fetch content block'));
    }
  }, [fetchBlockInfo, readMode?.blockID]);

  const matchingBlocks: MatchingBlock[] = React.useMemo(() => {
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

  React.useLayoutEffect(() => {
    const resolveConfigs = async () => {
      for (const block of matchingBlocks) {
        try {
          const config = await block.blockInfo.loadingFn({
            blockInfo: { ...block.blockInfo, mode },
            blockData: block.blockData,
          })();
          setState(prev => ({
            parcels: [...prev.parcels, { ...block, config }],
            isMatched: true,
          }));
        } catch (err) {
          console.error(err);
        }
      }
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
  }, [matchingBlocks, mode, state]);

  const appInfo = React.useMemo(() => {
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

  return (
    <React.Suspense
      fallback={
        <div>
          <TextLine animated={true} width={'w-full'} />
          <TextLine animated={true} width={'w-1/2'} />
        </div>
      }
    >
      {blockInfoQuery.error && (
        <div>
          <TextLine animated={true} width={'w-full'} />
          <TextLine animated={true} width={'w-1/2'} />
        </div>
      )}
      {!state.parcels.length && !state.isMatched && (
        <div>
          <TextLine animated={true} width={'w-full'} />
          <TextLine animated={true} width={'w-1/2'} />
        </div>
      )}
      {!state.parcels.length && state.isMatched && appInfo && (
        <>
          <Stack direction="row">
            <Stack direction="column">
              <Text variant={'button-sm'}>App not installed</Text>
              <Text variant="footnotes2" weight="normal">
                You need to install {appInfo.displayName} to see this content
              </Text>
            </Stack>
            <Stack>
              <Button label={'Install'} />
            </Stack>
          </Stack>
          <Divider />
        </>
      )}
      {state.parcels.map((matchingBlock, index) => {
        return (
          <div
            id={`${mode}_${matchingBlock.blockInfo.propertyType}_${index}`}
            key={`${mode}_${matchingBlock.blockInfo.propertyType}_${index}`}
          >
            <Parcel
              config={{ ...matchingBlock.config }}
              {...getContext()}
              blockInfo={{
                ...matchingBlock.blockInfo,
                mode,
              }}
              blockData={matchingBlock.blockData}
              blockRef={blockRef}
              content={matchingBlock.content}
            />
          </div>
        );
      })}
    </React.Suspense>
  );
};

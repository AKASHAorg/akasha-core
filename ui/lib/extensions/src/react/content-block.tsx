import * as React from 'react';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Parcel from 'single-spa-react/parcel';
import {
  ContentBlock,
  ContentBlockExtensionInterface,
  ContentBlockModes,
} from '@akashaorg/typings/lib/ui';
import { useGetContentBlockByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { ParcelConfigObject } from 'single-spa';

export type BlockExtensionInterface = {
  createBlock?: () => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
  }>;
};

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
  blockRef?: React.RefObject<BlockExtensionInterface>;
};

export const ContentBlockExtension = (props: ContentBlockExtensionProps) => {
  const { blockRef, mode, editMode, readMode } = props;
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const contentBlockStoreRef = React.useRef(getExtensionsPlugin()?.contentBlockStore);
  const [parcels, setParcels] = React.useState<(MatchingBlock & { config: ParcelConfigObject })[]>(
    [],
  );

  React.useLayoutEffect(() => {
    if (!contentBlockStoreRef.current && !!getExtensionsPlugin()) {
      contentBlockStoreRef.current = getExtensionsPlugin().contentBlockStore;
    }
  }, [getExtensionsPlugin]);

  const blockInfoQuery = useGetContentBlockByIdQuery(
    { id: readMode?.blockID },
    {
      enabled: !!readMode?.blockID,
      select: data => {
        if (hasOwn(data.node, 'id')) {
          return data.node;
        }
      },
    },
  );

  const matchingBlocks: MatchingBlock[] = React.useMemo(() => {
    if (!contentBlockStoreRef.current) return [];
    switch (mode) {
      case ContentBlockModes.EDIT:
        return contentBlockStoreRef.current.getMatchingBlocks({
          name: editMode.appName,
          propertyType: editMode.propertyType,
        });
      case ContentBlockModes.READONLY:
        if (!blockInfoQuery.data) return [];
        return contentBlockStoreRef.current.getMatchingBlocks(blockInfoQuery.data);
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
          setParcels(prev => [...prev, { ...block, config }]);
        } catch (err) {
          console.error(err);
        }
      }
    };
    if (matchingBlocks && matchingBlocks.length) {
      resolveConfigs().catch(err => console.error('failed to load content blocks'));
    }
  }, [matchingBlocks, mode]);

  return (
    <div>
      {parcels.map((matchingBlock, index) => {
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
    </div>
  );
};

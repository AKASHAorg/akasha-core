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

export type BlockExtensionInterface = {
  createBlock?: () => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
  }>;
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

  const matchingBlocks: {
    blockInfo: ContentBlockExtensionInterface & {
      appName: string;
    };
    blockData?: GetContentBlockByIdQuery['node'];
    content?: unknown;
  }[] = React.useMemo(() => {
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
  }, [props, blockInfoQuery.data]);

  console.log('matching blocks for', mode, matchingBlocks, readMode?.blockID);

  return (
    <div>
      {matchingBlocks &&
        matchingBlocks.map((matchingBlock, index) => (
          <div
            id={`${mode}_${matchingBlock.blockInfo.propertyType}_${index}`}
            key={`${mode}_${matchingBlock.blockInfo.propertyType}_${index}`}
          >
            <Parcel
              config={matchingBlock.blockInfo.loadingFn({
                blockInfo: { ...matchingBlock.blockInfo, mode },
                blockData: matchingBlock.blockData,
              })}
              wrapClassName={'relative'}
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
        ))}
    </div>
  );
};

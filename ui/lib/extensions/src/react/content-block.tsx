import * as React from 'react';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Parcel from 'single-spa-react/parcel';
import {
  ContentBlock,
  ContentBlockExtensionInterface,
  ContentBlockModes,
} from '@akashaorg/typings/lib/ui';
import { useGetContentBlockByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

export type BlockExtensionInterface = {
  createBlock?: () => Promise<{
    response: { blockID: string; error?: string };
    blockInfo: Omit<ContentBlock, 'loadingFn'> & { mode: ContentBlockModes };
  }>;
};

export type ContentBlockEditProps = {
  mode: ContentBlockModes.EDIT;
  propertyType: string;
  appName: string;
  blockRef?: React.RefObject<BlockExtensionInterface>;
};
export type ContentBlockReadOnlyProps = {
  mode: ContentBlockModes.READONLY;
  blockId: string;
  blockRef?: React.RefObject<BlockExtensionInterface>;
};

// export type ContentBlockInteractiveProps = {
//   mode: ContentBlockModes.INTERACTIVE;
//   blockRef?: React.RefObject<BlockExtensionInterface>;
// };

export type ContentBlockExtensionProps = ContentBlockEditProps | ContentBlockReadOnlyProps;

export const ContentBlockExtension = (
  props: Extract<ContentBlockExtensionProps, { mode: ContentBlockModes }>,
) => {
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const contentBlockStoreRef = React.useRef(getExtensionsPlugin().contentBlockStore);
  const blockId = React.useMemo(() => {
    if (hasOwn(props, 'blockId')) {
      return blockId;
    }
  }, [props]);

  const blockInfoQuery = useGetContentBlockByIdQuery(
    { id: blockId },
    {
      enabled: props.mode === ContentBlockModes.EDIT && blockId,
      select: data => {
        if (hasOwn(data.node, 'id')) {
          return data.node;
        }
      },
    },
  );

  const matchingBlock: ContentBlockExtensionInterface & { appName: string } = React.useMemo(() => {
    switch (props.mode) {
      case ContentBlockModes.EDIT:
        return contentBlockStoreRef.current.getMatchingBlock(props.appName, props.propertyType);
      case ContentBlockModes.READONLY:
        console.log(blockInfoQuery.data, '<< block info');
        return contentBlockStoreRef.current.getMatchingBlock();
      default:
        break;
    }
    return [];
  }, [props, blockInfoQuery]);

  return (
    <div>
      {matchingBlock && (
        <div key={`${props.mode}_${matchingBlock.propertyType}`}>
          <Parcel
            config={matchingBlock.loadingFn({ mode: props.mode })}
            {...getContext()}
            blockInfo={{ ...matchingBlock, mode: props.mode }}
            blockRef={props.blockRef}
          />
        </div>
      )}
    </div>
  );
};

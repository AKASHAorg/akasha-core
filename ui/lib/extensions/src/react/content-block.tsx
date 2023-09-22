import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Parcel from 'single-spa-react/parcel';
import { ContentBlockExtensionInterface, ContentBlockModes } from '@akashaorg/typings/lib/ui';

export type ContentBlockEditProps = {
  mode: ContentBlockModes.EDIT;
  propertyType: string;
  appName: string;
};
export type ContentBlockReadOnlyProps = {
  mode: ContentBlockModes.READONLY;
};
export type ContentBlockInteractiveProps = {
  mode: ContentBlockModes.INTERACTIVE;
};

export type ContentBlockExtensionProps =
  | ContentBlockEditProps
  | ContentBlockReadOnlyProps
  | ContentBlockInteractiveProps;

export const ContentBlockExtension = (
  props: Extract<ContentBlockExtensionProps, { mode: ContentBlockModes }>,
) => {
  const { getExtensionsPlugin, getContext } = useRootComponentProps();
  const contentBlockStoreRef = React.useRef(getExtensionsPlugin().contentBlockStore);

  const matchingBlocks: (ContentBlockExtensionInterface & { appName: string })[] =
    React.useMemo(() => {
      switch (props.mode) {
        case ContentBlockModes.EDIT:
          return contentBlockStoreRef.current.getMatchingBlocks(props.appName, props.propertyType);
        default:
          break;
      }
      return [];
    }, [props]);

  return (
    <div>
      {matchingBlocks.map((block, idx) => {
        return (
          <div key={`${props.mode}_${block.propertyType}_${idx}`}>
            <Parcel
              config={block.loadingFn({ mode: props.mode })}
              {...getContext()}
              blockInfo={{ ...block, mode: props.mode }}
            />
          </div>
        );
      })}
    </div>
  );
};

import * as React from 'react';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Parcel from 'single-spa-react/parcel';
import { ContentBlockExtensionInterface, ContentBlockModes } from '@akashaorg/typings/lib/ui';

export type ContentBlockEditProps = {
  mode: ContentBlockModes.EDIT;
  propertyType: string;
  appName: string;
  blockRef?: React.RefObject<any>;
};
export type ContentBlockReadOnlyProps = {
  mode: ContentBlockModes.READONLY;
  blockRef?: React.RefObject<any>;
};
export type ContentBlockInteractiveProps = {
  mode: ContentBlockModes.INTERACTIVE;
  blockRef?: React.RefObject<any>;
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

  const matchingBlock: ContentBlockExtensionInterface & { appName: string } = React.useMemo(() => {
    switch (props.mode) {
      case ContentBlockModes.EDIT:
        return contentBlockStoreRef.current.getMatchingBlock(props.appName, props.propertyType);
      default:
        break;
    }
    return [];
  }, [props]);

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

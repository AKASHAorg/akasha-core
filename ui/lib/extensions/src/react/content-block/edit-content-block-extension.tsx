import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ContentBlockModes, BlockInstanceMethods } from '@akashaorg/typings/lib/ui';
import { ParcelConfigObject } from 'single-spa';
import { BlockParcel } from './block-parcel';
import { MatchingBlock } from './index';

export type EditContentBlockExtensionProps = {
  blockRef?: React.RefObject<BlockInstanceMethods>;
  propertyType: string;
  appName: string;
  onError?: (error: Error) => void;
  externalHandler?: (value: never) => void;
};

export const EditContentBlockExtension: React.FC<EditContentBlockExtensionProps> = props => {
  const { blockRef, propertyType, appName, onError, externalHandler, ...remainingProps } = props;
  const { getExtensionsPlugin } = useRootComponentProps();
  const contentBlockStoreRef = useRef(getExtensionsPlugin()?.contentBlockStore);
  const [state, setState] = useState<{
    parcels: (MatchingBlock & { config: ParcelConfigObject })[];
    isMatched: boolean;
  }>({
    parcels: [],
    isMatched: false,
  });

  const matchingBlocks: MatchingBlock[] = useMemo(() => {
    if (!contentBlockStoreRef.current) return [];
    return contentBlockStoreRef.current.getMatchingBlocks({
      appName: appName,
      propertyType: propertyType,
    });
  }, [appName, propertyType]);

  useLayoutEffect(() => {
    const resolveConfigs = async () => {
      const newBlocks = [];

      for (const block of matchingBlocks) {
        try {
          const config = await block.blockInfo.loadingFn({
            blockInfo: { ...block.blockInfo, mode: ContentBlockModes.READONLY },
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
    } else if (matchingBlocks && !matchingBlocks.length && !state.isMatched) {
      setState({
        parcels: [],
        isMatched: true,
      });
    }
  }, [matchingBlocks, remainingProps, state]);

  return (
    <React.Suspense
      fallback={
        <Stack fullWidth={true} spacing="gap-y-1" customStyle="mb-2">
          <TextLine animated={true} width="w-full" />
          <TextLine animated={true} width="w-2/3" />
        </Stack>
      }
    >
      {!state.parcels.length && !state.isMatched && (
        <Stack fullWidth={true} spacing="gap-y-1" customStyle="mb-2">
          <TextLine animated={true} width="w-full" />
          <TextLine animated={true} width="w-2/3" />
        </Stack>
      )}
      {state.parcels.map((matchingBlock, index) => {
        return (
          <BlockParcel
            key={index}
            mode={ContentBlockModes.EDIT}
            matchingBlock={matchingBlock}
            blockId="0"
            index={index}
            blockRef={blockRef}
            externalHandler={externalHandler}
            onError={onError}
          />
        );
      })}
    </React.Suspense>
  );
};

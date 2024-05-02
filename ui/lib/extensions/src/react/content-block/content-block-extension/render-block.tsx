import React from 'react';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';
import { BlockParcel, BlockParcelProps } from '../block-parcel';
import { ParcelConfigObject } from 'single-spa';
import { MatchingBlock } from '../common.types';

export type RenderBlockProps = {
  state: { parcels: (MatchingBlock & { config: ParcelConfigObject })[]; isMatched: boolean };
  appInfo: { name: string; displayName: string; id: string };
  blockId: BlockParcelProps['blockId'];
  blockRef: BlockParcelProps['blockRef'];
  notInstalledTitle: string;
  installButtonLabel: string;
  notInstalledDescription1: string;
  notInstalledDescription2: string;
  onError: BlockParcelProps['onError'];
};

export const RenderBlock: React.FC<RenderBlockProps> = props => {
  const {
    state,
    appInfo,
    blockId,
    blockRef,
    notInstalledTitle,
    installButtonLabel,
    notInstalledDescription1,
    notInstalledDescription2,
    onError,
  } = props;

  return (
    <>
      {!state.parcels.length && (
        <>
          {!state.isMatched && !appInfo && (
            <Stack fullWidth={true} spacing="gap-y-1" customStyle="mb-2">
              <TextLine width="w-full" animated />
              <TextLine width="w-2/3" animated />
            </Stack>
          )}
          {state.isMatched && appInfo && (
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
                <Button variant="text" label={installButtonLabel} customStyle="ml-auto" />
              </Stack>
              <Text variant="footnotes2" weight="normal">
                {notInstalledDescription1} {appInfo.displayName} {notInstalledDescription2}
              </Text>
            </Stack>
          )}
        </>
      )}
      {state.parcels.map((matchingBlock, index) => {
        return (
          <BlockParcel
            key={index}
            mode={ContentBlockModes.READONLY}
            matchingBlock={matchingBlock}
            blockId={blockId}
            index={index}
            blockRef={blockRef}
            onError={onError}
          />
        );
      })}
    </>
  );
};

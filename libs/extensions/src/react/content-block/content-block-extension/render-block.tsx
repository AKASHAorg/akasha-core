import React from 'react';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { BlockParcel, BlockParcelProps } from '../block-parcel';
import { type ParcelConfigObject } from 'single-spa';
import { MatchingBlock } from '../common.types';
import { GetContentBlockByIdQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';
import { TextLineLoadingIndicator } from '../../text-line-loading-indicator';

export type RenderBlockProps = {
  state: { parcels: (MatchingBlock & { config: ParcelConfigObject })[] };
  appInfo: { name: string; displayName?: string; id: string };
  blockId: BlockParcelProps['blockId'];
  blockRef: BlockParcelProps['blockRef'];
  blockData: GetContentBlockByIdQuery['node'];
  matchingBlocks?: MatchingBlock[];
  notInstalledTitle: string;
  installButtonLabel: string;
  notInstalledDescription1: string;
  notInstalledDescription2: string;
  onError: BlockParcelProps['onError'];
  onClickInstall: (e: React.SyntheticEvent) => void;
};

export const RenderBlock: React.FC<RenderBlockProps> = props => {
  const {
    state,
    appInfo,
    blockId,
    blockRef,
    blockData,
    matchingBlocks,
    notInstalledTitle,
    installButtonLabel,
    notInstalledDescription1,
    notInstalledDescription2,
    onError,
    onClickInstall,
  } = props;

  return (
    <>
      {!blockData && !matchingBlocks.length && (
        <div className="w-full flex flex-col mb-2 gap-y-1">
          <TextLineLoadingIndicator width="w-full" />
          <TextLineLoadingIndicator width="w-2/3" />
        </div>
      )}
      {blockData && !matchingBlocks.length && (
        <div className="bg-card text-card-foreground border overflow-hidden p-0 border-none w-full rounded-none">
          <div className="text-card-foreground rounded-lg border overflow-hidden p-4 gap-y-2 bg-nested-card">
            <div className="flex flex-row p-0 gap-x-1">
              <p className="block text-[0.75rem] leading-[1.125rem] font-bold text-black dark:text-white text-start">
                {appInfo?.displayName} {notInstalledTitle}
              </p>
              <button
                className={`text-sm inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-bold
                  transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none
                  [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 dark:ring-ring/20 dark:outline-ring/40
                  outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0 cursor-pointer
                  text-primary underline-offset-4 hover:underline h-10 px-4 py-2 ml-auto`}
                onClick={onClickInstall}
              >
                {installButtonLabel}
              </button>
            </div>
            <p className="text-[0.75rem] leading-[1.125rem] font-medium text-black dark:text-white text-start font-normal">
              {notInstalledDescription1} {appInfo?.displayName} {notInstalledDescription2}
            </p>
          </div>
        </div>
      )}
      {blockData &&
        !!matchingBlocks.length &&
        state.parcels.map((matchingBlock, index) => {
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

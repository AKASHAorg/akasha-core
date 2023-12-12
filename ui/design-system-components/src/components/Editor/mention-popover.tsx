import React from 'react';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Portal } from './helpers';
import { tw, tx } from '@twind/core';
import { type Image, Profile } from '@akashaorg/typings/lib/ui';

export type MentionPopover = {
  values: Profile[];
  ref: React.Ref<HTMLDivElement>;
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
  transformSource: (src: Image) => Image;
};

export const MentionPopover: React.FC<MentionPopover> = React.forwardRef((props, ref) => {
  const { values, currentIndex, setIndex, handleSelect, transformSource } = props;

  return (
    <Portal>
      <div
        className={tw(
          `absolute -top-[9999px] -left-[9999px] z-50 p-1 bg(grey9 dark: grey1) rounded-lg border(grey8 dark:grey8)`,
        )}
        ref={ref}
      >
        {values.map((value, i) => (
          <div
            className={tx(
              `p-2 cursor-pointer rounded-sm max-w-xs min-w-[12rem] truncate hover:text-secondary ${
                i === currentIndex && 'bg-grey3'
              }`,
            )}
            key={i}
            onClick={() => {
              handleSelect(i);
            }}
            onMouseEnter={() => {
              setIndex(i);
            }}
          >
            <ProfileAvatarButton
              label={value.name}
              avatar={transformSource(value?.avatar?.default)}
              alternativeAvatars={value?.avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )}
              profileId={value.did.id}
            />
          </div>
        ))}
      </div>
    </Portal>
  );
});

MentionPopover.displayName = 'MentionPopover';

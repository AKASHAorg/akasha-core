import * as React from 'react';
import { Portal } from './helpers';
import { tw } from '@twind/core';
import DS from '@akashaorg/design-system-core';
import { IProfileData } from '@akashaorg/typings/ui';

const { ProfileAvatarButton } = DS;

export interface IMentionPopover {
  values: Partial<IProfileData>[];
  ref: React.Ref<HTMLDivElement>;
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
}

export const MentionPopover: React.FC<IMentionPopover> = React.forwardRef((props, ref) => {
  const { values, currentIndex, setIndex, handleSelect } = props;

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
            className={tw(
              `p-2 cursor-pointer p-1 rounded-sm max-w-xs min-w-[12rem] truncate hover:text-secondary ${
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
              info={value.userName && `@${value.userName}`}
              avatarImage={value.avatar}
              ethAddress={value.ethAddress as string}
            />
          </div>
        ))}
      </div>
    </Portal>
  );
});

MentionPopover.displayName = 'MentionPopover';

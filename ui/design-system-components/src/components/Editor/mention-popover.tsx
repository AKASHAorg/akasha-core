import React from 'react';
import { tw, tx } from '@twind/core';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import { Portal } from './helpers';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { getElevationClasses } from '@akashaorg/design-system-core/lib/utils';

export type MentionPopover = {
  values: Profile[];
  ref: React.Ref<HTMLDivElement>;
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
  transformSource: (src: Image) => Image;
  noMentionsLabel?: string;
};

export const MentionPopover: React.FC<MentionPopover> = React.forwardRef((props, ref) => {
  const { values, currentIndex, setIndex, handleSelect, transformSource, noMentionsLabel } = props;

  const boxShadow = getElevationClasses({ light: '2', dark: '3' });

  return (
    <Portal>
      <div
        className={tw(
          `absolute -top-[9999px] -left-[9999px] z-50 p-1 bg(white dark:grey3) rounded-lg border(grey8 dark:grey8) ${boxShadow}`,
        )}
        ref={ref}
      >
        {values.length === 0 && (
          <div className={tw(`max-w-[13rem] py-4 px-2`)}>
            <Text align="center">{noMentionsLabel}</Text>
          </div>
        )}
        {values.length > 0 &&
          values.map((value, i) => (
            <Button
              key={i}
              plain={true}
              onClick={() => {
                handleSelect(i);
              }}
              onMouseEnter={() => {
                setIndex(i);
              }}
            >
              <div
                className={tx(
                  `p-2 cursor-pointer rounded-sm max-w-xs min-w-[12rem] truncate hover:text(secondaryLight dark:secondaryDark) ${
                    i === currentIndex && 'bg(white dark:grey3)'
                  }`,
                )}
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
            </Button>
          ))}
      </div>
    </Portal>
  );
});

MentionPopover.defaultProps = {
  noMentionsLabel: 'You are not following someone with that name',
};

MentionPopover.displayName = 'MentionPopover';

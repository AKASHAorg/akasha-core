import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Portal } from './helpers';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import { getElevationClasses } from '@akashaorg/design-system-core/lib/utils';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { cssVars } from '@akashaorg/ui/lib/library/to-css-var';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

const MAX_MENTIONS_DISPLAY = 3;

const PROFILE_AVATAR_HEIGHT = 52;

export type MentionPopoverProps = {
  values: Profile[];
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
  transformSource: (src: Image) => Image;
  noMentionsLabel?: string;
  customStyle?: string;
};

export const MentionPopover = React.forwardRef<HTMLDivElement, MentionPopoverProps>(
  (props, ref) => {
    const {
      values,
      noMentionsLabel,
      customStyle = '',
      setIndex,
      handleSelect,
      transformSource,
    } = props;

    const boxShadow = getElevationClasses('2');

    // create portal on editor page, so that it clears when the component unmounts
    const beamEditorPage = document.getElementById('beam-editor_feed_page');

    return (
      <Portal targetNode={beamEditorPage}>
        <Stack
          ref={ref}
          style={cssVars({
            '--max-height': `${PROFILE_AVATAR_HEIGHT * MAX_MENTIONS_DISPLAY}px`,
            '--profile-avatar-height': `${PROFILE_AVATAR_HEIGHT}px`,
          })}
          className={cn(
            'absolute -top-[9999px] -left-[9999px] z-50 rounded-[0.5rem] border(grey8 dark:grey8) overflow-auto',
            boxShadow,
            `max-h-[var(--max-height)]`,
            customStyle,
          )}
        >
          {values.length === 0 && (
            <Card className="py-2 px-4 border-none">
              <Text variant="body2" align="start" color={{ light: 'grey4', dark: 'grey6' }}>
                {noMentionsLabel}
              </Text>
            </Card>
          )}
          {values.length > 0 &&
            values.map((value, i) => (
              <button
                key={i}
                onClick={() => {
                  handleSelect(i);
                }}
                onMouseEnter={() => {
                  setIndex(i);
                }}
                className={`px-4 py-2 h-[var(--profile-avatar-height)]`}
              >
                <ProfileAvatarButton profileDID={value.did.id}>
                  <ProfileAvatarButtonAvatar>
                    <ProfileAvatarButtonAvatarImage
                      src={
                        transformSource(value?.avatar?.default)?.src ||
                        value?.avatar?.alternatives?.map(alternative =>
                          transformSource(alternative),
                        )?.[0]?.src
                      }
                      alt="Author Avatar"
                    />
                    <ProfileAvatarButtonAvatarFallback />
                  </ProfileAvatarButtonAvatar>
                  <ProfileName>{value.name}</ProfileName>
                  <ProfileDidField />
                </ProfileAvatarButton>
              </button>
            ))}
        </Stack>
      </Portal>
    );
  },
);

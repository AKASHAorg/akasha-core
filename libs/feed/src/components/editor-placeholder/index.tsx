import React from 'react';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import type { Image, Profile } from '@akashaorg/typings/lib/ui';
import { ProfileAvatarImage } from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { ProfileAvatarFallback } from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { ProfileAvatar } from '@akashaorg/ui/lib/akasha-components/profile-avatar';

export type EditorPlaceholderType = {
  avatar?: Profile['avatar'];
  profileId: string | null;
  placeholderLabel: string;
  actionLabel?: string;
  isReflection?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
  transformSource: (src: Image) => Image;
};

/**
 * Component used as a call to action to redirect the user to the beam editor page
or to toggle the reflection editor
 * @param avatar - profile avatar data, an ipfs stored image
 * @param transformSource - utility function to provide ipfs images with gateways to be accessed
 * @param profileId - signed in user's profile id, in this case the DID
 * @param isReflection - sets if it is used for the reflection editor
 * @param onClick - handler for accessing the editor
 */
const EditorPlaceholder: React.FC<EditorPlaceholderType> = props => {
  const {
    avatar,
    profileId,
    placeholderLabel,
    actionLabel,
    isReflection = false,
    onClick,
    transformSource,
  } = props;
  return (
    <Card className="p-0 cursor-pointer bg-nested-card" onClick={onClick}>
      <div className={`flex justify-between p-4 `}>
        <div className={`flex flex-row items-center gap-4 flex-1`}>
          <ProfileAvatar profileDID={profileId} size="sm">
            <ProfileAvatarImage src={transformSource(avatar?.default)?.src} />
            <ProfileAvatarFallback />
          </ProfileAvatar>
          <Text
            variant="subtitle2"
            {...(isReflection && { color: 'grey7' })}
            customStyle={`${!isReflection ? 'max-w-[9.5rem] md:max-w-fit w-full' : ''} whitespace-normal`}
          >
            {placeholderLabel}
          </Text>
        </div>

        <Button size="sm">{actionLabel}</Button>
      </div>
    </Card>
  );
};

export default EditorPlaceholder;

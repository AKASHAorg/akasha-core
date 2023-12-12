import React from 'react';
import { tw } from '@twind/core';

import type { Image, Profile } from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface ICollaboratorProps {
  profile: Profile;
  isRed?: boolean;
  buttonLabel: string;
  onClick: () => void;
  transformSource: (src: Image) => Image;
}

const Collaborator: React.FC<ICollaboratorProps> = props => {
  const { profile, isRed = false, buttonLabel, onClick, transformSource } = props;

  return (
    <div className={tw(`flex flex-row w-full justify-between items-center`)}>
      <div className={tw(`flex flex-row gap-1 items-center`)}>
        <Avatar
          size="md"
          avatar={transformSource(profile?.avatar?.default)}
          alternativeAvatars={profile?.avatar?.alternatives?.map(alternative =>
            transformSource(alternative),
          )}
        />

        <Text variant="h5">{profile.name}</Text>
      </div>
      <Button
        size="lg"
        label={buttonLabel}
        customStyle={`${
          isRed && 'border(errorLight dark:errorDark) text(errorLight dark:errorDark)'
        }`}
        onClick={onClick}
      />
    </div>
  );
};

export default Collaborator;

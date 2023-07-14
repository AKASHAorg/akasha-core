import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Profile } from '@akashaorg/typings/ui';
import { tw } from '@twind/core';

export interface ICollaboratorProps {
  profile: Profile;
  isRed?: boolean;
  buttonLabel: string;
  onClick: () => void;
}

const Collaborator: React.FC<ICollaboratorProps> = props => {
  const { profile, isRed = false, buttonLabel, onClick } = props;

  return (
    <div className={tw(`flex flex-row w-full justify-between items-center`)}>
      <div className={tw(`flex flex-row gap-1 items-center`)}>
        <Avatar size="md" avatar={profile.avatar} />

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

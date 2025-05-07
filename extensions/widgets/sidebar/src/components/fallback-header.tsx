import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

export type FallbackHeaderProps = {
  authenticatedDID: string;
  isLoggedIn: boolean;
};

const FallbackHeader: React.FC<FallbackHeaderProps> = ({ authenticatedDID, isLoggedIn }) => {
  const { t } = useTranslation('ui-widget-sidebar');

  const headerBackground = 'bg-secondaryLight/30 dark:bg-grey5';

  return (
    <Stack
      direction="row"
      className={`justify-items-stretch p-4 border-b-1 border-grey9 dark:border-grey3 rounded-t-2xl ${headerBackground}`}
    >
      <Stack className="w-fit h-fit mr-2">
        <ProfileAvatar profileDID={authenticatedDID} size="lg">
          <ProfileAvatarFallback />
        </ProfileAvatar>
      </Stack>
      <Stack justifyContent="center" className="w-fit flex-grow">
        {isLoggedIn && <Text variant="button-md">{t('Fetching your info...')}</Text>}
        <ProfileAvatarButton profileDID={authenticatedDID}>
          <ProfileDidField />
        </ProfileAvatarButton>
      </Stack>
      <Stack className="w-fit h-fit self-start">
        <Button variant="default" size="sm" loading />
      </Stack>
    </Stack>
  );
};

export default FallbackHeader;

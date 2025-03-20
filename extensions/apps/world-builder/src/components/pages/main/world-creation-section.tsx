import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@/ui/profile-avatar-button';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Pencil } from 'lucide-react';
import { AkashaWorld } from '@akashaorg/typings/lib/sdk/graphql-types-new';

type WorldCreationSectionProps = {
  worldData: AkashaWorld;
};

export const WorldCreationSection: React.FC<WorldCreationSectionProps> = ({ worldData }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-world-builder');

  const { getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const handleNavToWorldCreate = () => {
    navigate({ to: '/world-create-form' });
  };

  const handleNavToProfile = (profileDID: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileDID}`,
    });
  };

  return (
    <Stack direction="column" spacing={4}>
      <Stack direction="row" justifyContent="between" alignItems="center">
        <Typography variant="h6">{t('World Creation')}</Typography>
        <Button variant="secondary" size="icon" onClick={handleNavToWorldCreate}>
          <Pencil />
        </Button>
      </Stack>

      <Stack direction="column" spacing={2}>
        <Typography variant="sm" bold>
          {t('Extension Publishers')}
        </Typography>
        {worldData?.extensionPublishers?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {worldData?.extensionPublishers?.map((extPublisher, idx) => (
              <ProfileAvatarButton
                key={idx}
                size="sm"
                profileDID={extPublisher?.id}
                onClick={() => handleNavToProfile(extPublisher?.id)}
              >
                <ProfileAvatarButtonAvatar>
                  <ProfileAvatarButtonAvatarImage
                    src={transformSource(extPublisher?.akashaProfile?.avatar?.default)?.src}
                  />
                  <ProfileAvatarButtonAvatarFallback />
                </ProfileAvatarButtonAvatar>
                <ProfileName>{extPublisher?.akashaProfile?.name}</ProfileName>
                <ProfileDidField />
              </ProfileAvatarButton>
            ))}
          </div>
        ) : (
          <Typography variant="sm">
            {t('You haven’t added any extension publishers yet.')}
          </Typography>
        )}
      </Stack>

      <Stack direction="column" alignItems="start" spacing={1}>
        <Typography variant="sm" bold>
          {t('Instance URL')}
        </Typography>
        {worldData?.instanceURL ? (
          <Button variant="link" className="p-0 h-5" asChild>
            <a rel="noreferrer" target="__blank" href={worldData?.instanceURL}>
              {worldData?.instanceURL}
            </a>
          </Button>
        ) : (
          <Typography variant="sm">{t('You haven’t added the instance URL yet.')}</Typography>
        )}
      </Stack>
    </Stack>
  );
};

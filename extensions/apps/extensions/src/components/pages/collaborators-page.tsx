import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { mockProfile } from './info-page';

type CollaboratorsPageProps = {
  appId: string;
};

export const CollaboratorsPage: React.FC<CollaboratorsPageProps> = ({ appId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const developers = [];
  for (let index = 1; index < 5; index++) {
    developers.push({ ...mockProfile, id: index });
  }

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <Text variant="h5">{t('Collaborators')}</Text>
          <Stack direction="row" align="center" spacing="gap-x-2">
            <Card
              elevation="none"
              radius={10}
              background={{
                light: 'grey8',
                dark: 'grey5',
              }}
              customStyle="w-[4.375rem] h-[4.375rem]"
            />
            <Stack direction="column" spacing="gap-y-1">
              <Text variant="body1" weight="semibold">
                {'name'}
              </Text>
              <Text variant="footnotes2" weight="normal" color="grey7">
                {'package name'}
              </Text>
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="column" spacing="gap-y-4">
            {developers.map((developer, idx) => (
              <Stack direction="column" spacing="gap-y-4" key={developer.id}>
                <Card
                  onClick={() => {
                    navigate({
                      to: '/info/$appId/developer/$devDid',
                      params: {
                        appId,
                        devDid: developer.profileId,
                      },
                    });
                  }}
                  type="plain"
                >
                  <Stack direction="row" align="center">
                    <ProfileAvatarButton
                      profileId={developer.profileId}
                      label={developer.name}
                      avatar={transformSource(developer?.avatar?.default)}
                      alternativeAvatars={developer?.avatar?.alternatives?.map(alternative =>
                        transformSource(alternative),
                      )}
                    />
                    <Icon
                      icon={<ChevronRightIcon />}
                      size="sm"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      customStyle="ml-auto"
                    />
                  </Stack>
                </Card>
                {idx < developers.length - 1 && <Divider />}
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Card>
    </>
  );
};

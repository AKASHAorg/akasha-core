import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { mockProfile } from '../info-page';
import ExtensionHeader from '@akashaorg/design-system-components/lib/components/ExtensionHeader';

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
          <ExtensionHeader
            appName={'Extension Name'}
            packageName="Package name"
            pageTitle={t('Collaborators')}
          />
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

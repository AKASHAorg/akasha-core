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
import ExtensionSubRouteHeader from '../InfoSubroutePageHeader';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { selectExtensionCollaborators } from '@akashaorg/ui-awf-hooks/lib/selectors/get-apps-query';

type CollaboratorsPageProps = {
  appId: string;
  extensionLogo?: AppImageSource;
  extensionName?: string;
  extensionDisplayName?: string;
  collaborators?: ReturnType<typeof selectExtensionCollaborators>;
  extensionType?: AkashaAppApplicationType;
};

export const CollaboratorsPage = (props: CollaboratorsPageProps) => {
  const {
    appId,
    extensionLogo,
    extensionName,
    extensionDisplayName,
    extensionType,
    collaborators,
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const developers = [];

  return (
    <>
      <Card padding="p-4">
        <Stack spacing="gap-y-4">
          <ExtensionSubRouteHeader
            pageTitle={t('Collaborators')}
            appName={extensionDisplayName}
            packageName={extensionName}
            appType={extensionType}
            appLogo={extensionLogo}
          />
          <Divider />
          <Stack direction="column" spacing="gap-y-4">
            {collaborators?.map((collab, idx) => (
              <Stack direction="column" spacing="gap-y-4" key={`${collab.akashaProfile?.id}-idx`}>
                <Card
                  onClick={() => {
                    navigate({
                      to: '/info/$appId/developer/$devDid',
                      params: {
                        appId,
                        devDid: collab.akashaProfile?.did.id,
                      },
                    });
                  }}
                  type="plain"
                >
                  <Stack direction="row" align="center">
                    <ProfileAvatarButton
                      profileId={collab.akashaProfile?.did.id}
                      label={collab.akashaProfile?.name}
                      avatar={transformSource(collab?.akashaProfile?.avatar?.default)}
                      alternativeAvatars={collab.akashaProfile?.avatar?.alternatives?.map(
                        alternative => transformSource(alternative),
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

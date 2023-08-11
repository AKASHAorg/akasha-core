import React, { useMemo } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import { ProfileHeader } from '@akashaorg/design-system-components/lib/components/Profile';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  useGetProfileByDidQuery,
  useGetInterestsByDidQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const InterestsPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;
  const { profileId } = useParams<{ profileId: string }>();
  const { t } = useTranslation('app-profile');

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const loginQuery = useGetLogin();

  const profileDataReq = useGetProfileByDidQuery(
    {
      id: profileId,
    },
    {
      select: response => response.node,
      enabled: !!loginQuery.data?.id,
    },
  );

  const interestsReq = useGetInterestsByDidQuery({ id: profileId });

  const topics = useMemo(
    () =>
      interestsReq.data?.node && hasOwn(interestsReq.data?.node, 'interests')
        ? interestsReq.data.node.interests.topics
        : [],

    [interestsReq.data],
  );

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const { isViewer, profile: profileData } = Object.assign(
    { isViewer: null, profile: null },
    profileDataReq.data,
  );

  const background = getProfileImageVersionsWithMediaUrl(profileData?.background);
  const avatar = getProfileImageVersionsWithMediaUrl(profileData?.avatar);
  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <ProfileHeader
        did={profileData?.did}
        validAddress={true}
        background={background}
        avatar={avatar}
        name={profileData?.name}
        ensName={null}
        viewerIsOwner={isViewer}
        copyLabel={t('Copy to clipboard')}
        copiedLabel={t('Copied')}
      />
      <Card elevation="1" radius={20} padding={16}>
        <Stack direction="column" spacing="gap-y-2.5">
          <Text variant="h5">{t('Interests')} </Text>
          <Stack align="center" justify="start" fullWidth spacing="gap-x-2">
            {topics && topics.map(topic => <Pill label={topic.value} size="sm" />)}
          </Stack>
        </Stack>
      </Card>
    </Stack>
  );
};

export default InterestsPage;

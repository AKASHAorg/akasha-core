import React, { useMemo, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import EditInterests from '@akashaorg/design-system-components/lib/components/EditInterests';
import { ProfileHeader } from '@akashaorg/design-system-components/lib/components/Profile';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetProfileByDidQuery,
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import {
  useShowFeedback,
  getProfileImageVersionsWithMediaUrl,
  hasOwn,
  useGetLogin,
} from '@akashaorg/ui-awf-hooks';

const InterestsPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;
  const { profileId } = useParams<{ profileId: string }>();
  const { t } = useTranslation('app-profile');

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const queryClient = useQueryClient();

  const [showFeedback, setShowFeedback] = useShowFeedback(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeInterests, setActiveInterests] = useState([]);

  const onMutate = () => {
    setIsProcessing(true);
  };

  const onSettled = () => {
    setIsProcessing(false);
  };

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
  const { akashaProfile: profileData } = Object.assign(
    { akashaProfile: null },
    profileDataReq.data,
  );
  const ownInterestsQueryReq = useGetInterestsByDidQuery(
    { id: profileId },
    { select: response => response.node },
  );
  const ownInterests = useMemo(
    () =>
      ownInterestsQueryReq.data && hasOwn(ownInterestsQueryReq.data, 'isViewer')
        ? ownInterestsQueryReq.data.akashaProfileInterests?.topics || []
        : [],
    [ownInterestsQueryReq.data],
  );
  const background = useMemo(
    () => getProfileImageVersionsWithMediaUrl(profileData?.background),
    [profileData?.background],
  );
  const avatar = useMemo(
    () => getProfileImageVersionsWithMediaUrl(profileData?.avatar),
    [profileData?.avatar],
  );
  const createInterest = useCreateInterestsMutation({
    onMutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetInterestsByDidQuery.getKey({
          id: profileId !== loginQuery.data?.id ? loginQuery.data?.id : profileId,
        }),
      });
      setShowFeedback(true);
    },
    onSettled,
  });

  if (!loginQuery.data?.id) {
    return navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
  }

  const handleInterestClick = topic => {
    //subscribe only if logged in user hasn't subscribed before otherwise navigate to the topic page
    if (!activeInterests.find(interest => interest.value === topic.value)) {
      const newActiveInterests = [...activeInterests, topic];
      createInterest.mutate({
        i: { content: { topics: newActiveInterests } },
      });
      setActiveInterests(newActiveInterests);
      return;
    }
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${topic}`,
    });
  };

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <ProfileHeader
        did={profileData?.did}
        validAddress={true}
        background={background}
        avatar={avatar}
        name={profileData?.name}
      />
      <Card elevation="1" radius={20} padding={'p-4'}>
        {profileId !== loginQuery.data?.id && (
          <Stack direction="column" spacing="gap-y-2.5">
            <Text variant="h5">{t('Interests')} </Text>
            <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey7' }}>
              {t(
                "Spot something interesting?  You can subscribe to any  of your fellow member interests and they'll shape the beams in your antenna! ",
              )}
            </Text>

            <Stack align="center" justify="start" spacing="gap-2" customStyle="flex-wrap w-full">
              {ownInterests.map((interest, idx) => (
                <Pill
                  key={`${idx}-${interest.value}`}
                  label={interest.value}
                  icon="CheckIcon"
                  iconDirection="right"
                  size="sm"
                  loading={
                    activeInterests.length > 0 &&
                    activeInterests[activeInterests.length - 1] === interest
                      ? isProcessing
                      : false
                  }
                  onPillClick={() => handleInterestClick(interest)}
                  active={!!activeInterests.find(activeInterest => activeInterest === interest)}
                />
              ))}
            </Stack>
          </Stack>
        )}
        {profileId === loginQuery.data?.id && (
          <EditInterests
            title={t('Your interests')}
            subTitle={t('(30 topics max.)')}
            description={t(
              'Your interests will help refine your social feed and throughout AKASHA World.',
            )}
            moreInterestTitle={t('Add more interests')}
            moreInterestDescription={t('Separate your interests by comma or space!')}
            moreInterestPlaceholder={t('Interests')}
            myInterests={ownInterests}
            interests={[]} /* TODO: when indexed list of interests hook is ready connect it */
            maxInterests={30}
            labelType="TOPIC"
            maxInterestsErrorMessage={t(
              'Max interests reached. Remove some interests to add more.',
            )}
            cancelButton={{
              label: t('Cancel'),
              disabled: isProcessing,
              handleClick: () => {
                navigateTo({
                  appName: '@akashaorg/app-profile',
                  getNavigationUrl: () => `/${profileId}`,
                });
              },
            }}
            saveButton={{
              label: 'Save',
              loading: isProcessing,
              handleClick: interests =>
                createInterest.mutate({
                  i: { content: { topics: interests } },
                }),
            }}
            customStyle="h-full"
          />
        )}
      </Card>
      {showFeedback && (
        <Snackbar
          title={t('Successfully subscribed to interest')}
          type="success"
          iconType="CheckCircleIcon"
          handleDismiss={() => {
            setShowFeedback(false);
          }}
          customStyle="mb-4"
        />
      )}
    </Stack>
  );
};

export default InterestsPage;

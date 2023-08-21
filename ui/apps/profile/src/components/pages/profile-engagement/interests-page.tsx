import React, { useMemo, useState } from 'react';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ProfileHeader } from '@akashaorg/design-system-components/lib/components/Profile';
import { Interests } from '@akashaorg/design-system-components/lib/components/EditProfile/Interests';
import {
  useGetProfileByDidQuery,
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { getProfileImageVersionsWithMediaUrl, hasOwn, useGetLogin } from '@akashaorg/ui-awf-hooks';

const InterestsPage: React.FC<RootComponentProps> = props => {
  const { plugins } = props;
  const { profileId } = useParams<{ profileId: string }>();
  const { t } = useTranslation('app-profile');

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const loginQuery = useGetLogin();

  const [showFeedback, setShowFeedback] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState('');

  if (showFeedback) {
    setTimeout(() => {
      setShowFeedback(false);
      setFeedbackMessage('');
    }, 6000);
  }

  const [isProcessing, setIsProcessing] = useState(false);
  const [topics, setTopics] = useState([]);

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
  // only fetch when the logged in user is not the owner of the profile interest page he is visiting
  const ownInterestsReq = useGetInterestsByDidQuery(
    { id: loginQuery.data?.id },
    { enabled: loginQuery.data?.id !== profileId },
  );

  const ownTopics = useMemo(
    () =>
      ownInterestsReq.data?.node && hasOwn(ownInterestsReq.data?.node, 'akashaProfileInterests')
        ? ownInterestsReq.data.node.akashaProfileInterests?.topics
        : null,

    [ownInterestsReq.data],
  );

  React.useEffect(() => {
    if (interestsReq.data?.node && hasOwn(interestsReq.data?.node, 'akashaProfileInterests')) {
      interestsReq.data.node.akashaProfileInterests?.topics
        ? setTopics(interestsReq.data.node.akashaProfileInterests?.topics)
        : setTopics([]);
    }
  }, [interestsReq.data, topics]);

  const queryClient = useQueryClient();

  const onMutate = () => {
    setIsProcessing(true);
  };

  const onSettled = () => {
    setIsProcessing(false);
  };

  const createInterest = useCreateInterestsMutation({
    onMutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useGetInterestsByDidQuery.getKey({
          id: profileId !== loginQuery.data?.id ? loginQuery.data?.id : profileId,
        }),
      });

      setFeedbackMessage(successText);
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

  const { isViewer, akashaProfile: profileData } = Object.assign(
    { isViewer: null, akashaProfile: null },
    profileDataReq.data,
  );

  const successText = `${t('Successfully subscribed to interest')}!`;

  const handleTopicClick = topic => {
    if (!ownTopics.find(interest => interest.value === topic.value)) {
      createInterest.mutate({
        i: { content: { topics: [...ownTopics, topic] } },
      });

      return;
    }

    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${topic}`,
    });
  };

  const background = getProfileImageVersionsWithMediaUrl(profileData?.background);
  const avatar = getProfileImageVersionsWithMediaUrl(profileData?.avatar);
  const outsiderText = t(
    "Spot something interesting?  You can subscribe to any  of your fellow member interests and they'll shape the beams in your antenna! ",
  );

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
              {outsiderText}
            </Text>

            <Stack align="center" justify="start" spacing="gap-2" customStyle="flex-wrap w-full">
              {topics &&
                topics.map((topic, idx) => (
                  <Pill
                    key={`${idx}-${topic.value}`}
                    label={topic.value}
                    icon="CheckIcon"
                    iconDirection="right"
                    size="sm"
                    onPillClick={() => handleTopicClick(topic)}
                    active={!!ownTopics.find(interest => interest.value === topic.value)}
                  />
                ))}
            </Stack>
          </Stack>
        )}
        {profileId === loginQuery.data?.id && (
          <Interests
            title={t('Your interests')}
            description={t(
              'Your interests will help refine your social feed and throughout AKASHA World.  You can have a maximum of 10 topics',
            )}
            moreInterestTitle={t('Find more interests')}
            moreInterestDescription={t(
              'You can find more interests and add them to your list of interests!',
            )}
            moreInterestPlaceholder={t('Search for interests')}
            myInterests={topics}
            interests={[]} /* TODO: when indexed list of interests hook is ready connect it */
            labelType="TOPIC"
            cancelButton={{
              label: t('Cancel'),
              disabled: isProcessing,
              handleClick: () => {
                //do something
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
          title={feedbackMessage}
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

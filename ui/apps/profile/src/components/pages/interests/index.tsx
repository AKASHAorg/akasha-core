import React, { useMemo, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import {
  CheckCircleIcon,
  CheckIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import EditInterests from '@akashaorg/design-system-components/lib/components/EditInterests';
import ProfileHeader from '../../profile-header';
import { useTranslation } from 'react-i18next';
import { useParams } from '@tanstack/react-router';
import {
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
  useUpdateInterestsMutation,
  GetInterestsByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  useShowFeedback,
  hasOwn,
  useRootComponentProps,
  useGetLogin,
} from '@akashaorg/ui-awf-hooks';
import getSDK from '@akashaorg/awf-sdk';
import { useApolloClient } from '@apollo/client';
import { AkashaProfileInterestsLabeled } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';
import { ProfileLoading } from '@akashaorg/design-system-components/lib/components/Profile';

const InterestsPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-profile');
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { profileId } = useParams({ strict: false });
  const { getRoutingPlugin } = useRootComponentProps();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeInterests, setActiveInterests] = useState([]);

  const [showFeedback, setShowFeedback] = useShowFeedback(false);

  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;
  const navigateTo = getRoutingPlugin().navigateTo;
  const apolloClient = useApolloClient();

  const { data: ownInterestsQueryData } = useGetInterestsByDidQuery({
    variables: { id: authenticatedDID },
    skip: !isLoggedIn,
  });
  const ownInterests = useMemo(() => {
    if (!isLoggedIn) return null;
    return ownInterestsQueryData &&
      hasOwn(ownInterestsQueryData.node, 'akashaProfileInterests') &&
      ownInterestsQueryData.node.akashaProfileInterests?.topics.length > 0
      ? ownInterestsQueryData.node.akashaProfileInterests?.topics.map(topic => ({
          value: topic.value,
          labelType: topic.labelType,
        }))
      : [];
  }, [isLoggedIn, ownInterestsQueryData]);

  const interestSubscriptionId = useMemo(() => {
    if (!isLoggedIn) return null;
    return ownInterestsQueryData && hasOwn(ownInterestsQueryData.node, 'akashaProfileInterests')
      ? ownInterestsQueryData.node.akashaProfileInterests?.id
      : null;
  }, [isLoggedIn, ownInterestsQueryData]);

  const sdk = getSDK();

  const [createInterestsMutation] = useCreateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  const [updateInterestsMutation] = useUpdateInterestsMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  if (authenticating) return <ProfileLoading />;

  if (!isLoggedIn) {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `/${profileId}`,
    });
    return null;
  }

  const handleInterestClick = topic => {
    //subscribe only if logged in user hasn't subscribed before otherwise navigate to the topic page
    if (!activeInterests.find(interest => interest.value === topic.value)) {
      const newActiveInterests = [...activeInterests, topic];

      runMutations(newActiveInterests);
      setActiveInterests(newActiveInterests);

      return;
    }
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${topic}`,
    });
  };

  const runMutations = (interests: AkashaProfileInterestsLabeled[]) => {
    setIsProcessing(true);
    if (interestSubscriptionId) {
      updateInterestsMutation({
        variables: {
          i: {
            id: interestSubscriptionId,
            content: {
              topics: interests,
            },
          },
        },
        onCompleted: async () => {
          await apolloClient.refetchQueries({ include: [GetInterestsByDidDocument] });
          setIsProcessing(false);
        },
        onError: () => {
          setIsProcessing(false);
        },
      });
    } else {
      createInterestsMutation({
        variables: {
          i: {
            content: {
              topics: interests,
            },
          },
        },
        onCompleted: async () => {
          await apolloClient.refetchQueries({ include: [GetInterestsByDidDocument] });
          setIsProcessing(false);
        },
        onError: () => {
          setIsProcessing(false);
        },
      });
    }
  };

  return (
    <>
      <ProfileHeader />
      <Stack direction="column" spacing="gap-y-4" fullWidth>
        <Card elevation="1" radius={20} padding={'p-4'}>
          {profileId !== authenticatedDID && (
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
                    key={`${idx}-${interest}`}
                    label={interest.value}
                    icon={<CheckIcon />}
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
          {profileId === authenticatedDID && (
            <EditInterests
              title={t('Your interests')}
              subTitle={t('(10 topics max.)')}
              description={t(
                'Your interests will help refine your social feed and throughout AKASHA World.',
              )}
              moreInterestTitle={t('Add more interests')}
              moreInterestDescription={t('Separate your interests by comma or space!')}
              moreInterestPlaceholder={t('Interests')}
              myInterests={ownInterests}
              interests={[]} /* TODO: when indexed list of interests hook is ready connect it */
              maxInterests={10}
              labelType={sdk.services.gql.labelTypes.INTEREST}
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
                label: t('Save'),
                loading: isProcessing,
                handleClick: interests => runMutations(interests),
              }}
              customStyle="h-full"
            />
          )}
        </Card>
        {showFeedback && (
          <Snackbar
            title={t('Successfully subscribed to interest')}
            type={NotificationTypes.Success}
            icon={<CheckCircleIcon />}
            handleDismiss={() => {
              setShowFeedback(false);
            }}
            customStyle="mb-4"
          />
        )}
      </Stack>
    </>
  );
};

export default InterestsPage;

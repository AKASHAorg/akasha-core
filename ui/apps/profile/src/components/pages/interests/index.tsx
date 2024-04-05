import React, { useEffect, useMemo, useState } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { CheckIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ProfileInterestsLoading } from '@akashaorg/design-system-components/lib/components/Profile';
import EditInterests from '@akashaorg/design-system-components/lib/components/EditInterests';
import { useTranslation } from 'react-i18next';
import {
  useGetInterestsByDidQuery,
  useCreateInterestsMutation,
  useUpdateInterestsMutation,
  GetInterestsByDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useRootComponentProps, useGetLogin } from '@akashaorg/ui-awf-hooks';
import getSDK from '@akashaorg/awf-sdk';
import { useApolloClient } from '@apollo/client';
import { AkashaProfileInterestsLabeled } from '@akashaorg/typings/lib/sdk/graphql-types-new';

type InterestsPageProps = {
  profileDid: string;
};

const InterestsPage: React.FC<InterestsPageProps> = props => {
  const { profileDid } = props;
  const { t } = useTranslation('app-profile');
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { getRoutingPlugin } = useRootComponentProps();

  const [isProcessing, setIsProcessing] = useState(false);
  const [activeInterests, setActiveInterests] = useState([]);

  const authenticatedDID = loginData?.id;
  const isLoggedIn = !!loginData?.id;
  const navigateTo = getRoutingPlugin().navigateTo;
  const apolloClient = useApolloClient();

  const { data: profileInterestsQueryData, loading } = useGetInterestsByDidQuery({
    variables: { id: profileDid },
    skip: !isLoggedIn,
  });

  const { data: ownInterestsQueryData } = useGetInterestsByDidQuery({
    variables: { id: authenticatedDID },
    skip: !isLoggedIn,
  });

  // get interests for the profile being viewed
  const profileInterests = useMemo(() => {
    if (!isLoggedIn) return null;
    return profileInterestsQueryData &&
      hasOwn(profileInterestsQueryData.node, 'akashaProfileInterests') &&
      profileInterestsQueryData.node.akashaProfileInterests?.topics.length > 0
      ? profileInterestsQueryData.node.akashaProfileInterests?.topics.map(topic => ({
          value: topic.value,
          labelType: topic.labelType,
        }))
      : [];
  }, [isLoggedIn, profileInterestsQueryData]);

  // get interests for the logged profile
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

  useEffect(() => {
    if (ownInterests && ownInterests.length) {
      setActiveInterests([...activeInterests, ...ownInterests]);
    }
  }, [ownInterests]);

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

  if (loading || authenticating) return <ProfileInterestsLoading />;

  const handleInterestClick = (topic: { value: string; labelType: string }) => {
    // subscribe only if logged in user hasn't subscribed before otherwise navigate to the topic page
    if (!activeInterests.find(interest => interest.value === topic.value)) {
      const newActiveInterests = [...activeInterests, topic];

      runMutations(newActiveInterests);
      setActiveInterests(newActiveInterests);

      return;
    }
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${topic.value}`,
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
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <Card elevation="1" radius={20} padding={'p-4'}>
        {profileDid !== authenticatedDID && (
          <Stack direction="column" spacing="gap-y-2.5">
            <Text variant="h5">{t('Interests')} </Text>
            <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey7' }}>
              {t(
                "Spot something interesting?  You can subscribe to any  of your fellow member interests and they'll shape the beams in your antenna! ",
              )}
            </Text>

            <Stack
              direction="row"
              align="center"
              justify="start"
              spacing="gap-x-2"
              customStyle="flex-wrap"
              fullWidth
            >
              {profileInterests?.map((interest, idx) => (
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
                  active={!!activeInterests.find(ac => ac.value === interest.value)}
                  type="action"
                />
              ))}
            </Stack>
          </Stack>
        )}
        {profileDid === authenticatedDID && (
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
                  getNavigationUrl: () => `/${profileDid}`,
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
    </Stack>
  );
};

export default InterestsPage;

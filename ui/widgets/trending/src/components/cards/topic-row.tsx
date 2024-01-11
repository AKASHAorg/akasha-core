import React, { useMemo } from 'react';
import getSDK from '@akashaorg/awf-sdk';
import { hasOwn } from '@akashaorg/ui-awf-hooks';
import { useGetIndexedStreamCountQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AkashaIndexedStreamStreamType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  CheckIcon,
  HashtagIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';
import DuplexButton from '@akashaorg/design-system-core/lib/components/DuplexButton';

export type TopicRowProps = {
  tag: string;
  subscribedTags?: string[];
  // labels
  noTagsLabel?: string;
  tagSubtitleLabel: string;
  subscribeLabel: string;
  subscribedLabel: string;
  unsubscribeLabel: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  // handlers
  onClickTopic: (topic: string) => void;
  // setSubscribedInterests: React.Dispatch<React.SetStateAction<string[]>>;
  showLoginModal: () => void;
  handleTopicUnsubscribe: (topic: string) => void;
  handleTopicSubscribe: (topic: string) => void;
};

export const TopicRow: React.FC<TopicRowProps> = props => {
  const {
    tagSubtitleLabel,
    tag,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
    isLoggedIn,
    isLoading,
    onClickTopic,
    // setSubscribedInterests,
    showLoginModal,
    handleTopicUnsubscribe,
    handleTopicSubscribe,
  } = props;
  const sdk = getSDK();
  const { data: beamCountData, loading: loadingCount } = useGetIndexedStreamCountQuery({
    variables: {
      indexer: sdk.services.gql.indexingDID,
      filters: {
        and: [
          { where: { streamType: { equalTo: AkashaIndexedStreamStreamType.Beam } } },
          { where: { indexType: { equalTo: sdk.services.gql.labelTypes.TAG } } },
          { where: { indexValue: { equalTo: tag } } },
          { where: { active: { equalTo: true } } },
        ],
      },
    },
  });

  const beamCount = useMemo(() => {
    return beamCountData && hasOwn(beamCountData.node, 'akashaIndexedStreamListCount')
      ? beamCountData.node.akashaIndexedStreamListCount
      : 0;
  }, [beamCountData]);

  return (
    <Stack
      direction="row"
      align="center"
      justify="between"
      spacing="gap-x-3"
      customStyle="w-(full xl:[19rem])"
    >
      <SubtitleTextIcon
        label={tag}
        subtitle={
          !loadingCount && beamCount > 0
            ? `${beamCount} ${tagSubtitleLabel}s`
            : `${beamCount} ${tagSubtitleLabel}`
        }
        icon={<HashtagIcon />}
        backgroundColor={true}
        onClick={() => onClickTopic(tag)}
      />

      <DuplexButton
        inactiveLabel={subscribeLabel}
        activeLabel={subscribedLabel}
        activeHoverLabel={unsubscribeLabel}
        active={subscribedTags?.includes(tag)}
        iconDirection="left"
        activeIcon={<CheckIcon />}
        activeHoverIcon={<XMarkIcon />}
        inactiveVariant="secondary"
        loading={isLoading}
        hoverColors={{
          background: { light: 'transparent', dark: 'transparent' },
          border: { light: 'errorLight', dark: 'errorDark' },
          text: { light: 'errorLight', dark: 'errorDark' },
          icon: { light: 'errorLight', dark: 'errorDark' },
        }}
        fixedWidth={'w-[7rem]'}
        onClickActive={() => handleTopicUnsubscribe(tag)}
        onClickInactive={() => handleTopicSubscribe(tag)}
      />
    </Stack>
  );
};

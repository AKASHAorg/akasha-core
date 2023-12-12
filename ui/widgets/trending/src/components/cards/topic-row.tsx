import React from 'react';
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
        subtitle={`0 ${tagSubtitleLabel}`}
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

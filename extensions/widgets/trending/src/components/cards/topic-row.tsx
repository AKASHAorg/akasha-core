import React, { useMemo } from 'react';
import getSDK from '@akashaorg/core-sdk';
import { hasOwn } from '@akashaorg/ui-core-hooks';
import { useGetIndexedStreamCountQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { AkashaIndexedStreamStreamType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { CheckIcon, HashIcon, XIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import {
  DuplexButton,
  DuplexButtonInactive,
  DuplexButtonActive,
  DuplexButtonHover,
} from '@akashaorg/ui/lib/akasha-components/duplex-button';
import SubtitleTextIcon from '@akashaorg/design-system-core/lib/components/SubtitleTextIcon';

export type TopicRowProps = {
  tag: string;
  subscribedTags?: string[];
  // labels
  noTagsLabel?: string;
  tagSubtitleLabel: string;
  subscribeLabel: string;
  subscribedLabel: string;
  unsubscribeLabel: string;
  isLoading: boolean;
  // handlers
  onClickTopic: (topic: string) => void;
  handleTopicSubscription: (topic: string, subscribing?: boolean) => void;
};

export const TopicRow: React.FC<TopicRowProps> = props => {
  const {
    tagSubtitleLabel,
    tag,
    subscribeLabel,
    subscribedLabel,
    unsubscribeLabel,
    subscribedTags,
    isLoading,
    onClickTopic,
    handleTopicSubscription,
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
      alignItems="center"
      justifyContent="between"
      spacing={3}
      className="w-full xl:w-[19rem]"
    >
      <SubtitleTextIcon
        label={tag}
        subtitle={
          !loadingCount && beamCount > 1
            ? `${beamCount} ${tagSubtitleLabel}s`
            : `${beamCount} ${tagSubtitleLabel}`
        }
        icon={<HashIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />}
        backgroundColor={true}
        onClick={() => onClickTopic(tag)}
      />

      <DuplexButton
        active={!!subscribedTags?.includes(tag)}
        size="sm"
        loading={isLoading}
        className="w-[7rem]"
      >
        <DuplexButtonInactive onClick={() => handleTopicSubscription(tag)} variant={'outline'}>
          {subscribeLabel}
        </DuplexButtonInactive>

        <DuplexButtonHover
          variant="destructive"
          onClick={() => handleTopicSubscription(tag, false)}
        >
          <XIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
          {unsubscribeLabel}
        </DuplexButtonHover>

        <DuplexButtonActive variant={'outline'}>
          <CheckIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
          {subscribedLabel}
        </DuplexButtonActive>
      </DuplexButton>
    </Stack>
  );
};

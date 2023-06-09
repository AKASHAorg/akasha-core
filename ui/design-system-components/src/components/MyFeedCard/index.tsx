import * as React from 'react';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { tw } from '@twind/core';

export interface MyFeedCardProps {
  title: string;
  description: string;
  noPostsTitle: string;
  noPostsDescription: string;
  CTALabel: string;
  onClickCTA: () => void;
  hasPosts: boolean;
}

const MyFeedCard: React.FC<MyFeedCardProps> = props => {
  const { title, description, noPostsTitle, noPostsDescription, CTALabel, onClickCTA, hasPosts } =
    props;
  return (
    <BasicCardBox>
      <div className={tw(`flex items-center py-6 px-4`)}>
        {!hasPosts && (
          <>
            <Icon type="QueueListIcon" size="lg" accentColor={true} />
            <Text variant="h1" align="center" customStyle="mt-6">
              {noPostsTitle}
            </Text>

            <Text variant="h3" align="center" customStyle="my-6">
              {noPostsDescription}
            </Text>
          </>
        )}
        {hasPosts && (
          <>
            <Text variant="h1" align="center" customStyle="mt-6">
              {title}
            </Text>

            <Text variant="h3" align="center" customStyle="my-6">
              {description}
            </Text>
          </>
        )}
      </div>
      <div className={tw(`flex flex-end p-4`)}>
        <button className={tw(`flex flex-row `)} onClick={onClickCTA}>
          <Text variant="h3" color={{ dark: 'secondaryDark', light: 'secondaryLight' }}>
            {CTALabel}
          </Text>
          <Icon type="ChevronRightIcon" accentColor={true} />
        </button>
      </div>
    </BasicCardBox>
  );
};

export default MyFeedCard;

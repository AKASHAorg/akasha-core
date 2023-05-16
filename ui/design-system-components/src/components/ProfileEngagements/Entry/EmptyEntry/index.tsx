import React, { ReactNode } from 'react';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';

export type EmptyEntryProps = {
  type: 'following' | 'followers';
  viewerIsOwner?: boolean;
  userName?: string;
  titleLabel?: ReactNode;
  bodyLabel?: ReactNode;
};

const EmptyEntry: React.FC<EmptyEntryProps> = ({
  titleLabel,
  bodyLabel,
  type,
  userName = 'user',
  viewerIsOwner = true,
}) => {
  if (!viewerIsOwner && type === 'following')
    return <InfoCard titleLabel={`@${userName} is not following anyone yet!`} />;

  let props = {
    titleLabel: titleLabel ? titleLabel : 'Looks like there are no followers!',
    bodyLabel: bodyLabel ? (
      bodyLabel
    ) : (
      <>
        Interacting with people on AKASHA&apos;s
        <br /> Apps will help get followers!
      </>
    ),
  };

  if (type === 'following') {
    props = {
      titleLabel: titleLabel ? titleLabel : 'You are not following anyone yet!',
      bodyLabel: bodyLabel ? (
        bodyLabel
      ) : (
        <>
          By following others, will help you see interesting
          <br /> content written and shared by them!
        </>
      ),
    };
  }

  return <InfoCard {...props} />;
};

export default EmptyEntry;

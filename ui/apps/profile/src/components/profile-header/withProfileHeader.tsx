import React, { ReactNode, Suspense } from 'react';
import FollowingFeedback from '../following-feedback';
import ProfileHeaderView, { ProfileHeaderViewProps } from './profile-header';
import { ProfileHeaderLoading } from '@akashaorg/design-system-components/lib/components/Profile';

export const withProfileHeader = <T extends ProfileHeaderViewProps>(
  wrappedComponent: ReactNode,
) => {
  return (props: T) => {
    return (
      <>
        <Suspense fallback={<ProfileHeaderLoading />}>
          <ProfileHeaderView {...props} />
        </Suspense>
        {wrappedComponent}
        <FollowingFeedback />
      </>
    );
  };
};

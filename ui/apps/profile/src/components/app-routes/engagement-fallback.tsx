import React from 'react';
import ProfileEngagementLoading from '@akashaorg/design-system-components/lib/components/ProfileEngagements/placeholders/profile-engagement-loading';
import EngagementTab from '../pages/profile-engagement/engagement-tab';
import ProfileHeader from '../profile-header';

type EngagementFallbackProps = {
  profileId: string;
};
const EngagementFallback: React.FC<EngagementFallbackProps> = props => {
  const { profileId } = props;
  return (
    <>
      <ProfileHeader profileId={profileId} />
      <EngagementTab>
        <ProfileEngagementLoading />
      </EngagementTab>
    </>
  );
};

export default EngagementFallback;

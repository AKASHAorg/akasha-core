import * as React from 'react';
import ContentLoader from 'react-content-loader';

const ProfileCardSectionSkeleton = () => {
  return (
    <ContentLoader>
      <rect x="75" y="233" rx="4" ry="4" width="100" height="13" />
      <rect x="75" y="260" rx="4" ry="4" width="50" height="8" />
    </ContentLoader>
  );
};

export default ProfileCardSectionSkeleton;

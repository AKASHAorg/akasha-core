import * as React from 'react';

interface ProfilePageProps {
  match: {
    params: {
      profileId: string;
    };
  };
}

const ProfilePage = (props: ProfilePageProps) => {
  const { params } = props.match;
  return <div>Profile of {params.profileId}</div>;
};

export default ProfilePage;

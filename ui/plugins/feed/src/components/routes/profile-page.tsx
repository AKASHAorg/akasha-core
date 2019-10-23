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
  console.log(props, 'the props');
  return <div>Profile of {params.profileId}</div>;
};

export default ProfilePage;

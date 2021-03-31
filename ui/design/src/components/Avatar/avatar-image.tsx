import * as React from 'react';

const AvatarImage = (props: any) => {
  const { image } = props;
  let avatar;
  // if (typeof image === 'object' && image.hasOwnProperty('read')) {
  //   avatar = image.read();
  // }
  if (typeof image === 'string') {
    avatar = image;
  }

  return <img data-testid="avatar-image" src={avatar} />;
};

export default AvatarImage;

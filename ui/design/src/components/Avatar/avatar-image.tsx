import * as React from 'react';

const AvatarImage = (props: { image: string }) => {
  const { image } = props;
  let avatar;
  // if (typeof image === 'object' && image.hasOwnProperty('read')) {
  //   avatar = image.read();
  // }
  if (typeof image === 'string') {
    avatar = image;
  }

  return (
    <picture>
      <img data-testid="avatar-image" src={avatar} />
    </picture>
  );
};

export default AvatarImage;

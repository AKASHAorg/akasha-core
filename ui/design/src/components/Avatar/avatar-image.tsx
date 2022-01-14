import * as React from 'react';

const AvatarImage = (props: { image: string; faded?: boolean }) => {
  const { image, faded } = props;
  let avatar;
  // if (typeof image === 'object' && image.hasOwnProperty('read')) {
  //   avatar = image.read();
  // }
  if (typeof image === 'string') {
    avatar = image;
  }

  return (
    <picture style={{ ...(faded && { opacity: '0.5' }) }}>
      <img data-testid="avatar-image" alt="avatar" src={avatar} />
    </picture>
  );
};

export default AvatarImage;

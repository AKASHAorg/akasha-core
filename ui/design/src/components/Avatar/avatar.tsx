/* eslint-disable */
import * as React from 'react';
import CommonInterface from '../../interfaces/common.interface';
import MarginInterface from '../../interfaces/margin.interface';
import { loadPlaceholder } from './placeholders';
import StyledAvatar, { AvatarSize } from './styled-avatar';

export interface AvatarProps extends CommonInterface<HTMLDivElement> {
  src?: string;
  // @Todo: fix this
  onClick?: React.EventHandler<React.SyntheticEvent>;
  alt?: string;
  margin?: MarginInterface;
  backgroundColor?: string;
  withBorder?: boolean;
  guest?: boolean;
  seed: string;
  size?: AvatarSize;
}

const getAvatarFromSeed = (seed: string) => {
  // @Todo: fix this to be more reliable
  const avatarOption = Array.from(seed.replace('0x', '')).reduce(
    // @ts-ignore
    (sum: number, letter: string) => sum + letter.codePointAt(0),
    0,
  );

  return (avatarOption % 7) + 1;
};

const defaultProps: Partial<AvatarProps> = {
  size: 'md' as AvatarSize,
  withBorder: false,
  seed: '0x0000000000000000000000000000000',
};

/*
 * if guest is true, render avatar in guestMode (same avatar image for all guests)
 * if guest is false and src is missing or empty string, it means
 * that a user (possibly registered) does not set his avatar (determine which avatar to show
 * based on his eth address).
 * There is one more possible case when the guest is false and src is not yet loader
 * (aka. the profile data is not loaded yet), in that case, the avatar should be
 * in loading state.
 */

const Avatar: React.FC<AvatarProps & typeof defaultProps> = props => {
  const { onClick, guest, src, seed, className, size, margin, withBorder } = props;
  const isClickable = typeof onClick === 'function';
  let avatarImage;
  if (guest || !src) {
    avatarImage = loadPlaceholder(`placeholder_${getAvatarFromSeed(seed)}`);
  } else if (src) {
    avatarImage = src;
  }

  return (
    <StyledAvatar
      onClick={onClick}
      size={size!}
      className={className}
      isClickable={isClickable}
      margin={margin}
      withBorder={withBorder}
    >
      <React.Suspense fallback={<>...</>}>
        <AvatarImage image={avatarImage} />
      </React.Suspense>
    </StyledAvatar>
  );
};

Avatar.defaultProps = defaultProps;

const AvatarImage = (props: any) => {
  const { image } = props;
  let avatar;
  if (image.hasOwnProperty('read') && typeof image.read === 'function') {
    const img = image.read();
    if (img) {
      avatar = img;
    }
  } else if (typeof image === 'string') {
    avatar = image;
  }

  return <img src={avatar} />;
};

export default Avatar;

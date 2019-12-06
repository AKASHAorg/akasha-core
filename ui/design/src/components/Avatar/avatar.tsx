/* eslint-disable */
import * as React from 'react';
import CommonInterface from '../../interfaces/common.interface';
import MarginInterface from '../../interfaces/margin.interface';
import AvatarImage from './avatar-image';
import { loadPlaceholder } from './placeholders';
import StyledAvatar, { AvatarSize } from './styled-avatar';

export interface AvatarProps extends CommonInterface<HTMLDivElement> {
  src: string;
  onClick?: React.MouseEventHandler<any>;
  alt?: string;
  margin?: MarginInterface;
  backgroundColor?: string;
  withBorder?: boolean;
  guest?: boolean;
  size?: AvatarSize;
}

export const getAvatarFromSeed = (seed: string) => {
  let str = seed;
  if (seed.startsWith('0x')) {
    str = seed.replace('0x', '');
  }
  if (str && str.length) {
    const avatarOption = Array.from(str).reduce((sum: number, letter: string) => {
      if (letter.codePointAt(0)) {
        return sum + letter.codePointAt(0)!;
      }
      return sum;
    }, 0);
    return (avatarOption % 7) + 1;
  }
  // load the first placeholder, just to not throw and error
  return 1;
};

const defaultProps: Partial<AvatarProps> = {
  size: 'md' as AvatarSize,
  withBorder: false,
  src: '0x0000000000000000000000000000000',
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
  const { onClick, guest, src, className, size, margin, withBorder } = props;
  const isClickable = typeof onClick === 'function';
  let avatarImage;
  if (guest) {
    avatarImage = loadPlaceholder(`placeholder_${getAvatarFromSeed(src)}`);
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

export default Avatar;

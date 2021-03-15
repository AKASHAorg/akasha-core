/* eslint-disable */
import * as React from 'react';
import CommonInterface from '../../interfaces/common.interface';
import MarginInterface from '../../interfaces/margin.interface';
import AvatarImage from './avatar-image';
// import { loadPlaceholder } from './placeholders';
import StyledAvatar, { AvatarSize } from './styled-avatar';

export interface AvatarProps extends CommonInterface<HTMLDivElement> {
  ethAddress?: string | null;
  src?: string;
  onClick?: React.MouseEventHandler<any>;
  alt?: string;
  margin?: MarginInterface;
  backgroundColor?: string;
  border?: 'sm' | 'md' | 'lg';
  size?: AvatarSize;
  publicImgPath?: string;
}

export const getAvatarFromSeed = (seed: string | null) => {
  let str = seed;
  if (seed && seed.startsWith('0x')) {
    str = seed.replace('0x', '');
  }
  if (str && str.length) {
    const avatarOption = Array.from(str).reduce((sum: number, letter: string) => {
      if (parseInt(letter, 10)) {
        return sum + parseInt(letter, 10);
      }
      return sum;
    }, 0);
    // if user is a visitor his address is 0x0000... so sum is 0
    // so you can give him a specific placeholder (for now placeholder_7)
    if (avatarOption === 0) {
      return 7;
    }
    return (avatarOption % 6) + 1;
  }
  // load the first placeholder, just to not throw and error
  return 7;
};

const Avatar: React.FC<AvatarProps> = props => {
  const {
    onClick,
    src,
    className,
    size = 'md',
    margin,
    border,
    ethAddress = '0x0000000000000000000000000000000',
    publicImgPath = '/images',
  } = props;
  const isClickable = typeof onClick === 'function';
  let avatarImage;
  if (src) {
    avatarImage = src;
  }
  if (!avatarImage) {
    const seed = getAvatarFromSeed(ethAddress);
    avatarImage = `${publicImgPath}/avatar-placeholder-${seed}.png`;
  }

  return (
    <StyledAvatar
      onClick={onClick}
      size={size!}
      className={className}
      isClickable={isClickable}
      margin={margin}
      border={border}
    >
      <React.Suspense fallback={<></>}>
        <AvatarImage image={avatarImage} />
      </React.Suspense>
    </StyledAvatar>
  );
};

export default Avatar;

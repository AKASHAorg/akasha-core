/* eslint-disable */
import * as React from 'react';
import CommonInterface from '../../interfaces/common.interface';
import MarginInterface from '../../interfaces/margin.interface';
import StyledAvatar, { AvatarSize } from './styled-avatar';

export interface AvatarProps extends CommonInterface<HTMLDivElement> {
  src: string;
  onClick?: React.EventHandler<React.SyntheticEvent<HTMLDivElement, MouseEvent>>;
  alt?: string;
  margin?: MarginInterface;
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps & Partial<typeof defaultProps>> = props => {
  const isClickable = typeof props.onClick === 'function';

  return (
    <StyledAvatar
      roundedCorners={props.roundedCorners}
      onClick={props.onClick}
      size={props.size!}
      isClickable={isClickable}
      margin={props.margin}
      backgroundColor={props.backgroundColor}
    >
      <img src={props.src} alt={props.alt} />
    </StyledAvatar>
  );
};

const defaultProps = {
  size: 'xs' as AvatarSize,
  roundedCorners: true,
};
Avatar.defaultProps = defaultProps;

export default Avatar;

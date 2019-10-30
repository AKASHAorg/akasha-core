import * as React from 'react';
import { capitalize } from '../../utils/string-utils';
import Avatar from '../Avatar';
import StyledIconLink from './styled-icon-link';
import {
  AvatarButtonWrapper,
  AvatarWrapper,
  ButtonInfo,
  ButtonTextWrapper,
} from './styled-profile-avatar-button';

interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage: string;
  label: string;
  size?: string;
  className?: string;
  onAvatarClick?: React.EventHandler<React.SyntheticEvent>;
  onClick: React.EventHandler<React.SyntheticEvent>;
}

const ProfileAvatarButton = (props: ProfileAvatarButtonProps) => {
  return (
    <AvatarButtonWrapper className={props.className}>
      <AvatarWrapper>
        <Avatar size="md" src={props.avatarImage} onClick={props.onAvatarClick} />
      </AvatarWrapper>
      <ButtonTextWrapper>
        <StyledIconLink label={capitalize(props.label)} size={props.size} onClick={props.onClick} />
        <ButtonInfo>{props.info}</ButtonInfo>
      </ButtonTextWrapper>
    </AvatarButtonWrapper>
  );
};

export default ProfileAvatarButton;

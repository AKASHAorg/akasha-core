import { Box } from 'grommet';
import * as React from 'react';
import { capitalize } from '../../utils/string-utils';
import Avatar from '../Avatar';
import StyledIconLink from './styled-icon-link';
import { ButtonInfo, ButtonTextWrapper } from './styled-profile-avatar-button';

interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage: string;
  label: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onAvatarClick?: React.EventHandler<React.SyntheticEvent>;
  onClick: React.EventHandler<React.SyntheticEvent>;
}

const ProfileAvatarButton = (props: ProfileAvatarButtonProps) => {
  return (
    <Box className={props.className} direction="row" align="center">
      <Box>
        <Avatar size={props.size} src={props.avatarImage} onClick={props.onAvatarClick} />
      </Box>
      <ButtonTextWrapper>
        <StyledIconLink label={capitalize(props.label)} onClick={props.onClick} />
        <ButtonInfo>{props.info}</ButtonInfo>
      </ButtonTextWrapper>
    </Box>
  );
};

export default ProfileAvatarButton;

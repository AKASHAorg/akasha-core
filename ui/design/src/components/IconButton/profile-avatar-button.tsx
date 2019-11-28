import { Box } from 'grommet';
import * as React from 'react';
import { capitalize } from '../../utils/string-utils';
import { Avatar } from '../Avatar/index';
import { AvatarSize } from '../Avatar/styled-avatar';
import { ethAddress } from '../Cards/entry-box';
import StyledIconLink from './styled-icon-link';
import { ButtonInfo, ButtonTextWrapper } from './styled-profile-avatar-button';

export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: string;
  label?: string;
  size?: AvatarSize;
  className?: string;
  onAvatarClick?: React.MouseEventHandler<ethAddress>;
  // @todo: fix this
  onClick: React.MouseEventHandler<any>;
  guest?: boolean;
  seed: string;
}

const ProfileAvatarButton = (props: ProfileAvatarButtonProps) => {
  const { className, size, avatarImage, label, info, onClick, onAvatarClick, guest, seed } = props;
  return (
    <Box className={className} direction="row" align="center">
      <Box>
        <Avatar size={size} src={avatarImage} onClick={onAvatarClick} guest={guest} seed={seed} />
      </Box>
      <ButtonTextWrapper>
        <StyledIconLink label={capitalize(label)} onClick={onClick} />
        <ButtonInfo>{info}</ButtonInfo>
      </ButtonTextWrapper>
    </Box>
  );
};

const defaultProps = {
  size: 'md',
};
ProfileAvatarButton.defaultProps = defaultProps;

export default ProfileAvatarButton;

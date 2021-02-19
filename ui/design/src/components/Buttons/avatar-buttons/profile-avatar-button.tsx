import { Box } from 'grommet';
import * as React from 'react';
import { truncateMiddle } from '../../../utils/string-utils';
import { Avatar } from '../../Avatar/index';
import { AvatarSize } from '../../Avatar/styled-avatar';
import StyledIconLink from '../icon-buttons/styled-icon-link';
import { ButtonInfo, StyledWrapperBox } from './styled-profile-avatar-button';

export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: string;
  label?: string;
  size?: AvatarSize;
  className?: string;
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  ethAddress: string;
  bold?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const ProfileAvatarButton = React.forwardRef((props: ProfileAvatarButtonProps, ref: any) => {
  const {
    className,
    size,
    avatarImage,
    label,
    info,
    onClick,
    onClickAvatar,
    ethAddress,
    bold,
    onMouseEnter,
    onMouseLeave,
  } = props;
  return (
    <StyledWrapperBox className={className} direction="row" align="center">
      <Box>
        <Avatar size={size} src={avatarImage} ethAddress={ethAddress} onClick={onClickAvatar} />
      </Box>
      <Box
        pad={{ horizontal: 'small' }}
        justify="center"
        align="start"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <StyledIconLink
          primaryColor={true}
          label={label || truncateMiddle(ethAddress)}
          ref={ref}
          bold={bold}
        />
        <ButtonInfo>{info}</ButtonInfo>
      </Box>
    </StyledWrapperBox>
  );
});

const defaultProps = {
  size: 'md' as AvatarSize,
};

ProfileAvatarButton.defaultProps = defaultProps;

export default ProfileAvatarButton;

import * as React from 'react';
import { Box } from 'grommet';
import { truncateMiddle } from '../../utils/string-utils';
import Avatar from '../Avatar';
import { AvatarSize } from '../Avatar/styled-avatar';
import { ButtonInfo, StyledText, StyledWrapperBox } from './styled-profile-avatar-button';
import { Profile } from '@akashaorg/typings/ui';

export interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage?: Profile['avatar'];
  label?: string;
  size?: AvatarSize;
  className?: string;
  onClickAvatar?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  profileId: string;
  bold?: boolean;
  active?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const ProfileAvatarButton = React.forwardRef(
  (props: ProfileAvatarButtonProps, ref: React.Ref<HTMLElement>) => {
    const {
      className,
      size,
      avatarImage,
      label,
      info,
      onClick,
      onClickAvatar,
      profileId,
      active,
      onMouseEnter,
      onMouseLeave,
    } = props;
    return (
      <StyledWrapperBox className={className} direction="row" align="center">
        <Box flex={{ shrink: 0 }}>
          <Avatar size={size} avatar={avatarImage} profileId={profileId} onClick={onClickAvatar} />
        </Box>
        <Box
          pad={{ horizontal: 'small' }}
          justify="center"
          align="start"
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <StyledText ref={ref}>{label || truncateMiddle(profileId)}</StyledText>
          <ButtonInfo active={active}>{info}</ButtonInfo>
        </Box>
      </StyledWrapperBox>
    );
  },
);

const defaultProps = {
  size: 'md' as AvatarSize,
};

ProfileAvatarButton.defaultProps = defaultProps;

export default ProfileAvatarButton;

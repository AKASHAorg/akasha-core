import * as React from 'react';
import styled from 'styled-components';
import Avatar from '../Avatar';
import StyledIconLink from './styled-icon-link';

interface ProfileAvatarButtonProps {
  info: string | React.ReactElement;
  avatarImage: string;
  label: string;
  onAvatarClick?: React.EventHandler<React.SyntheticEvent>;
  onClick: React.EventHandler<React.SyntheticEvent>;
}
const AvatarButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const AvatarWrapper = styled.div`
  display: flex;
`;

const ButtonTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  ${StyledIconLink} {
    line-height: ${props => props.theme.spacing.components.iconButton.lineHeight};
    font-weight: bolder;
    color: ${props => props.theme.colors.darkBlue};
  }
`;

const ButtonInfo = styled.div`
  font-size: ${props => props.theme.spacing.components.iconButton.fontSize.sm};
  padding: ${props => props.theme.spacing.components.iconButton.padding};
  line-height: ${props => props.theme.spacing.components.iconButton.lineHeight};
  font-weight: lighter;
`;

const ProfileAvatarButton = (props: ProfileAvatarButtonProps) => {
  return (
    <AvatarButtonWrapper>
      <AvatarWrapper>
        <Avatar size="md" src={props.avatarImage} onClick={props.onAvatarClick} />
      </AvatarWrapper>
      <ButtonTextWrapper>
        <StyledIconLink label={props.label} />
        <ButtonInfo>{props.info}</ButtonInfo>
      </ButtonTextWrapper>
    </AvatarButtonWrapper>
  );
};

export default ProfileAvatarButton;

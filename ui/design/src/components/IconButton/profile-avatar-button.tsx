import * as React from 'react';
import styled from 'styled-components';
import { capitalize } from '../../utils/string-utils';
import Avatar from '../Avatar';
import StyledIconLink from './styled-icon-link';

interface ProfileAvatarButtonProps {
  info?: string | React.ReactElement;
  avatarImage: string;
  label: string;
  onAvatarClick?: (ev: React.SyntheticEvent) => void;
  onClick?: (ev: React.SyntheticEvent) => void;
  size?: string;
  className?: string;
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

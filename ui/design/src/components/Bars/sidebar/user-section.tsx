import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import { Icon } from '../../Icon/index';
import { StyledUserSectionBox } from './styled-sidebar';

export interface IUserSectionProps {
  avatarImage?: string;
  ethAddress: string;
  notifications?: any;
}

const UserSection: React.FC<IUserSectionProps> = props => {
  const { avatarImage, ethAddress } = props;
  return (
    <StyledUserSectionBox
      pad="xsmall"
      border={{
        color: 'border',
        size: 'xsmall',
        style: 'solid',
        side: 'bottom',
      }}
      align="center"
      direction="column"
      gap="small"
    >
      <Avatar ethAddress={ethAddress} src={avatarImage} />
      <Icon type="notifications" clickable={true} />
      <Icon type="search" clickable={true} />
      <Icon type="activity" clickable={true} />
    </StyledUserSectionBox>
  );
};

export { UserSection };

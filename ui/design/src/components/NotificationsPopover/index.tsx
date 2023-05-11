import { Box, Text } from 'grommet';
import * as React from 'react';
import Avatar from '../Avatar';
import BasicPopover from '../BasicPopover';
import { StyledListContainer, StyledListElem } from './styled-notifications-popover';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export interface INotificationsPopover {
  className?: string;
  onClickNotification: () => void;
  dataSource: INotification[];
  target: HTMLElement;
  closePopover: () => void;
}

export interface INotification {
  profileId: string;
  user: string;
  userAvatar: Profile['avatar'];
  time: string;
  action: string;
}

const NotificationsPopover: React.FC<INotificationsPopover> = props => {
  const { className, closePopover, dataSource, onClickNotification, target } = props;
  return (
    <BasicPopover
      closePopover={closePopover}
      target={target}
      gap={'-0.313em'}
      className={className}
    >
      <StyledListContainer pad={{ vertical: 'small', horizontal: 'xxsmall' }} overflow="scroll">
        {dataSource &&
          dataSource.map((notification, index) => (
            <StyledListElem onClick={onClickNotification} key={index}>
              <Box
                margin={{ vertical: 'xsmall', horizontal: 'small' }}
                direction="row"
                align="center"
                gap="small"
              >
                <Avatar size="sm" avatar={notification.userAvatar} profileId={notification.user} />
                <Box direction="column">
                  <Text size="medium" weight="bold">
                    {notification.action}
                  </Text>
                  <Text size="small" color="secondaryText">
                    {notification.time}
                  </Text>
                </Box>
              </Box>
            </StyledListElem>
          ))}
      </StyledListContainer>
    </BasicPopover>
  );
};

export default NotificationsPopover;

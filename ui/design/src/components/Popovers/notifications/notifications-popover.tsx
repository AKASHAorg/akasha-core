import { Box, Text } from 'grommet';
import * as React from 'react';
import { Avatar } from '../../Avatar/index';
import BasicPopover from '../common/basic-popover';
import { StyledListContainer, StyledListElem } from './styled-notifications-popover';

export interface INotificationsPopover {
  className?: string;
  onClickNotification: () => void;
  dataSource: INotification[];
  target: React.RefObject<any>;
  closePopover: () => void;
}

export interface INotification {
  ethAddress: string;
  user: string;
  userAvatar: string;
  time: string;
  action: string;
}

const NotificationsPopover: React.FC<INotificationsPopover> = props => {
  const { className, closePopover, dataSource, onClickNotification, target } = props;
  return (
    <BasicPopover closePopover={closePopover} target={target} gap={'-5px'} className={className}>
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
                <Avatar size="sm" src={notification.userAvatar} ethAddress={notification.user} />
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

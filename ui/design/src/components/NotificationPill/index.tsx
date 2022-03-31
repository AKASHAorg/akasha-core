import * as React from 'react';
import { Box, Text } from 'grommet';
import Icon from '../Icon';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  position: absolute;
  bottom: 0;
`;

export interface INotificationPill {
  infoLabel: string;
  handleDismiss?: () => void;
  icon: JSX.Element;
}

const NotificationPill: React.FC<INotificationPill> = props => {
  const { infoLabel, handleDismiss, icon } = props;
  return (
    <StyledBox
      direction="row"
      gap="small"
      pad="small"
      round="large"
      background={{ color: 'darkBorder' }}
      fill="horizontal"
      width={{ max: '40rem' }}
      align="center"
      justify="center"
    >
      {icon}
      <Text color="primaryText">{infoLabel}</Text>
      <Icon type="close" onClick={handleDismiss} clickable={true} />
    </StyledBox>
  );
};

export default NotificationPill;

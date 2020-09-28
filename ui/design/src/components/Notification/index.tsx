import React from 'react';
import { toast as notify, ToastContainer, ToastContainerProps } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

export interface NotificationProps extends ToastContainerProps {
  position: any;
  pauseOnVisibilityChange: boolean;
}

const toastClassName = 'akashaToast';

const NotificationBase: React.FunctionComponent<NotificationProps> = props => {
  return <ToastContainer toastClassName={toastClassName} {...props} />;
};

const Notification = styled(NotificationBase)`
  font-size: 100%;
  & .${toastClassName} {
    font-size: 100%;
    font-family: ${props => props.theme.shapes.fontFamily};
    color: ${props => props.theme.colors.dark};
    background: ${props => props.theme.colors.background};
  }
`;

export { Notification, notify };

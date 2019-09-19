// import { ButtonProps } from 'grommet'
import React, { useContext } from 'react';
import Modal from 'react-modal';
import { ThemeContext, DefaultTheme } from 'styled-components';
import commonInterface from '../../interfaces/common.interface';
import Button, { IButtonProps } from '../Button';
import { ButtonType } from '../Button/styled-button';
import { ModalHeader, ModalBody, ModalFooter } from './styled-modal';

export interface ModalProps extends commonInterface<any>, React.PropsWithChildren<any> {
  isOpen: boolean;
  onAfterOpen?: () => {};
  onRequestClose?: () => {};
  closeTimeoutMS: number;
  style?: object;
  ariaHideApp?: boolean;
  shouldFocusAfterRender?: boolean;
  shouldCloseOnOverlayClick?: boolean;
  shouldCloseOnEsc?: boolean;
  shouldReturnFocusAfterClose?: boolean;
  aria?: object;
  data?: object;
  title?: string;
  onClose?: any;
  okText?: string;
  okButtonProps?: IButtonProps;
  cancelButtonProps?: IButtonProps;
  onOk?: any;
  onCancel?: any;
  closable?: boolean;
  children?: React.ReactNode;
}

const defaultOkButtonProps = {
  disabled: false,
  buttonType: 'primary' as ButtonType,
};

const defaultCancelButtonProps = {
  disabled: false,
  ghost: true,
};

const createStyle = (styledComponentsTheme: DefaultTheme) => ({
  content: {
    position: 'fixed',
    top: '20%',
    left: `20%`,
    bottom: 'auto',
    right: 'auto',
    backgroundColor: styledComponentsTheme.colors.white,
    color: styledComponentsTheme.colors.dark,
    border: 0,
    fontFamily: styledComponentsTheme.shapes.fontFamily,
    padding: 0,
    borderRadius: styledComponentsTheme.shapes.borderRadius,
    boxShadow: styledComponentsTheme.shapes.shadow0,
    width: styledComponentsTheme.spacing.components.modal.maxWidth,
  },
  overlay: {
    backgroundColor: styledComponentsTheme.colors.background,
  },
});

// const closeButton: React.FunctionComponent<ModalProps['onClose']> = onClose => (
//   <button onClick={onClose} {...defaultCancelButtonProps}>
//     Close
//   </button>
// )
const CustomModal: React.FunctionComponent<ModalProps> = ({
  title,
  onOk,
  onClose,
  okText,
  cancelButtonProps,
  onCancel,
  closable,
  okButtonProps,
  children,
  ...props
}) => {
  const styledComponentsTheme = useContext(ThemeContext);
  const style = createStyle(styledComponentsTheme);

  return (
    <Modal style={style} {...props}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button onClick={onCancel} {...(cancelButtonProps || defaultCancelButtonProps)}>
          Cancel
        </Button>
        <Button onClick={onOk} {...(okButtonProps || defaultOkButtonProps)}>
          {okText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default CustomModal;

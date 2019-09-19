import styled, { css } from 'styled-components';

const ModalHeader = styled.div`
  margin: 0;
  color: ${props => props.theme.colors.dark};
  ${props => {
    const { padding, headerGap } = props.theme.spacing.components.modal;

    return css`
      padding: ${padding} ${padding} ${headerGap};
    `;
  }}
  font-weight: ${props => props.theme.shapes.fontWeight.bold};
  font-size: ${props => props.theme.spacing.fontSize};
  line-height: ${props => props.theme.spacing.lineHeight};
  word-wrap: break-word;
`;

const ModalBody = styled.div`
  padding: 0 ${props => props.theme.spacing.components.modal.padding};
  font-size: ${props => props.theme.spacing.fontSize};
  line-height: ${props => props.theme.spacing.lineHeight};
  word-wrap: break-word;
`;

const ModalFooter = styled.div`
  padding: ${props => props.theme.spacing.components.modal.padding};
  text-align: right;

  & button:first-of-type {
    margin-right: ${props => props.theme.spacing.components.modal.buttonGap};
  }
`;

export { ModalHeader, ModalBody, ModalFooter };

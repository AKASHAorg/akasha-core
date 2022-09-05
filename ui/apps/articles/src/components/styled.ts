import styled from 'styled-components';
import DS from '@akashaorg/design-system';

const { Button, TextArea, TextInput } = DS;

export const StyledButton = styled(Button)`
  border-width: 1px;
`;

export const StyledTextInput = styled(TextInput)`
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.938rem;
  padding: 0;
  color: inherit;
  &:focus {
    outline: none;
  }
`;

export const StyledImageInput = styled.input`
  display: none;
`;

export const StyledTextArea = styled(TextArea)`
  border: none;
  outline: none;
  background: transparent;
  padding: 0;
  color: inherit;
  &:focus {
    outline: none;
  }
`;

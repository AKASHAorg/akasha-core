import styled from 'styled-components';
import DS from '@akashaorg/design-system';

const { Button } = DS;

export const StyledButton = styled(Button)`
  border-width: 1px;
`;

export const StyledInput = styled.input`
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

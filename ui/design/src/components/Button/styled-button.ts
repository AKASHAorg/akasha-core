import { Button } from 'grommet';
import styled, { css } from 'styled-components';

const StyledButton = styled(Button)`
  height: 2rem;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  color: ${props => props.theme.colors.accent};
  white-space: nowrap;
  &:hover {
    box-shadow: none;
  }
  ${props => {
    if (props.primary) {
      return css`
        color: ${props.theme.colors.white};
      `;
    }
    return;
  }}
`;

export default StyledButton;

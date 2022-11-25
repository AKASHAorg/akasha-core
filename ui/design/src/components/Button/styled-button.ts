import { Button } from 'grommet';
import styled, { css } from 'styled-components';

const StyledButton = styled(Button)<{
  height?: number;
  slimBorder?: boolean;
  accentBorder?: boolean;
}>`
  height: ${props => (props.height ? `${props.height}rem` : '2rem')};
  border-width: ${props => (props.slimBorder ? '1px' : 'initial')};
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  border-color: ${props => (props.accentBorder ? props.theme.colors.accent : '')};
  color: ${props => props.theme.colors.btnAccentColor};
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
  }};
`;

export default StyledButton;

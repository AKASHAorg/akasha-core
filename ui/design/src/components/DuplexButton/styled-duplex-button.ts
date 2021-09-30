import { Button } from 'grommet';
import styled, { css } from 'styled-components';

const StyledButton = styled(Button)<{ active: boolean }>`
  height: 2rem;
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  border: 1px solid ${props => props.theme.colors.accent};
  color: ${props => props.theme.colors.accent};
  & * {
    stroke: ${props => props.theme.colors.accent};
  }
  &:hover {
    box-shadow: none;
  }
  ${props => {
    if (props.active) {
      return css`
        background-color: ${props.theme.colors.accent};
        color: ${props.theme.colors.white};
        & * {
          stroke: ${props.theme.colors.white};
        }
        &:hover {
          background-color: ${props.theme.colors.background};
          border: 1px solid red;
          color: red;
          & * {
            stroke: red;
          }
        }
      `;
    }
    return;
  }}
`;

export { StyledButton };

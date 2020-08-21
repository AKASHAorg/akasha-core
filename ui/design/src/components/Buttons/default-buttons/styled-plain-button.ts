import { Box, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledPlainButton = styled(Box)<{ disabled?: boolean; color?: string }>`
  padding: 0 0.8em;
  ${props => {
    if (props.disabled) {
      return css`
        color: '#DDD';
        ${StyledText} {
          cursor: default;
        }
      `;
    }
    return css`
      color: ${props.color ? props.theme.colors[props.color] : props.theme.colors.secondaryText};
    `;
  }}
  svg {
    height: 100%;
    width: 1.25rem;
    stroke: ${props => props.theme.colors.lightGrey};
    & * {
      stroke: ${props => props.theme.colors.secondaryText};
    }
  }
`;

const StyledText = styled(Text)`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

export { StyledPlainButton, StyledText };

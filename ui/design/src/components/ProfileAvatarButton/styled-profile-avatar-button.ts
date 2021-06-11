import { Box, Text } from 'grommet';
import styled, { css } from 'styled-components';

const StyledWrapperBox = styled(Box)`
  display: inline-flex;
`;

const StyledText = styled(Text)`
  font-size: 1rem;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 600;
  color: ${props => props.theme.colors.primaryText};
`;

const ButtonInfo = styled.div<{ active?: boolean }>`
  max-width: 10rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem;
  line-height: 1rem;
  ${props => {
    if (props.active) {
      return css`
        color: ${props.theme.colors.accent};
      `;
    }
    return css`
      color: ${props.theme.colors.secondaryText};
    `;
  }}
`;

export { ButtonInfo, StyledText, StyledWrapperBox };

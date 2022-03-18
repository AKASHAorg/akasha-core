import styled from 'styled-components';
import { Box } from 'grommet';

export const StyledIcon = styled(Box)`
  display: flex;
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
`;

export const StyledArrowIcon = styled(StyledIcon)`
  border: 1px solid ${props => props.theme.colors.accent};
`;

export const StyledCheckmarkIcon = styled(StyledIcon)`
  border: 1px solid ${props => props.theme.colors.green};
`;

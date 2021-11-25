import { Box, BoxExtendedProps } from 'grommet';
import styled from 'styled-components';

export const StyledBox = styled(Box)<BoxExtendedProps & { error: string }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => props.theme.colors.accent};
  padding: 1rem;
  border-radius: 0.4rem;
  border: 1px solid ${props => (props.error ? props.theme.colors.red : props.theme.colors.accent)};
`;

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

export const CircleDashed = styled(StyledIcon)`
  border: 1px dashed ${props => props.theme.colors.grey};
`;

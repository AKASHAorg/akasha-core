import styled from 'styled-components';
import { Box, Text } from 'grommet';

export const StyledImage = styled.img`
  max-width: 50%;
  margin: 0 auto;
  height: auto;
  padding: 2rem 0.5rem 2rem 0;
`;

export const StyledText = styled(Text)`
  line-height: 1.5rem;
  padding: 1.2rem 0;
`;

export const StyledBox = styled(Box)<{ shouldMinimize?: boolean }>`
  height: auto;
  max-height: ${props => (props.shouldMinimize ? '0' : '25rem')};
  opacity: ${props => (props.shouldMinimize ? 0 : 1)};
  z-index: ${props => (props.shouldMinimize ? -1 : 1)};
  transition: 0.25s ease-in-out max-height, 0.25s ease-out opacity;
  padding: 0 3.5rem;

  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    padding: 0 2rem;
  }
`;

export const WrapperBox = styled(Box)`
  border: ${props => `1px solid ${props.theme.colors.lightBackground}`};
  border-radius: 0.25rem;
  margin: 0.5rem;
`;

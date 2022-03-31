import styled, { css } from 'styled-components';
import { Box, Text } from 'grommet';

export const StyledImage = styled.img`
  max-width: 50%;
  margin: 0 auto;
  height: auto;
  padding: 2rem 0.5rem 2rem 0;
`;

export const StyledText = styled(Text)`
  line-height: 1.5rem;
  padding: 1.2rem 2rem;
  color: ${props => props.theme.colors.grey};
  @media screen and (max-width: ${props => props.theme.breakpoints.large.value}px) {
    text-align: left;
  }
`;

export const StyledBox = styled(Box)<{ loggedIn?: boolean }>`
  height: auto;
  @media screen and (max-width: ${props => props.theme.breakpoints.large.value}px) {
    display: none;
  }

  ${props =>
    props.loggedIn &&
    css`
      display: none;
    `};
`;

export const WrapperBox = styled(Box)<{ loggedIn?: boolean }>`
  border: ${props => `1px solid ${props.theme.colors.lightBackground}`};
  border-radius: 0.25rem;
  padding: 1.15rem 1rem;
  margin: 0 0.5rem 0.5rem 0.5rem;
`;

export const StyledSubtitle = styled(StyledText)`
  padding: 0;
  margin-top: 0.5rem;
`;

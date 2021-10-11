import styled from 'styled-components';
import { Box } from 'grommet';

import Button from '../Button';

import { BasicCardBox } from '../EntryCard/basic-card-box';

const StyledErrorCard = styled(BasicCardBox)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
`;

const StyledImage = styled.img`
  max-width: 50%;
  margin: 0 auto;
  height: auto;
  padding: 2em 0;
`;

const PageWrapper: any = styled(Box)`
  background: white;
`;

const ContentWrapper: any = styled(Box)`
  padding: 0rem 5rem 1.2rem;
  border-radius: 0.5rem;
  span {
    letter-spacing: 0.03em;
  }
  @media screen and (max-width: ${props => props.theme.breakpoints.small.value}px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const StyledButton = styled(Button)`
  height: auto;
  padding: 0.25rem 0.5rem;
`;

export { StyledErrorCard, StyledImage, PageWrapper, ContentWrapper, StyledButton };

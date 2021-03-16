import styled from 'styled-components';
import { Box, Button } from 'grommet';

import { BasicCardBox } from '../Cards';

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
  margin: auto;
  position: absolute;
  top: 40%;
  transform: translate(0, -50%);
  border-radius: 0.5rem;
  span {
    letter-spacing: 0.03em;
  }
`;

const StyledButton = styled(Button)`
  height: auto;
  padding: 0.25rem 0.5rem;
`;

export { StyledErrorCard, StyledImage, PageWrapper, ContentWrapper, StyledButton };

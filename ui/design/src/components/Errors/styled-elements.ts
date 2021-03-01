import styled from 'styled-components';
import { Box } from 'grommet';

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
  background: ${props => props.theme.colors.modalBackgroundAlt};
`;

const ContentWrapper: any = styled(Box)`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background: white;
  border-radius: 0.5rem;
  span {
    letter-spacing: 0.03em;
  }
`;
export { StyledErrorCard, StyledImage, PageWrapper, ContentWrapper };

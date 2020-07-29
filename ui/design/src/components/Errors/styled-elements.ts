import styled from 'styled-components';
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
export { StyledErrorCard, StyledImage };

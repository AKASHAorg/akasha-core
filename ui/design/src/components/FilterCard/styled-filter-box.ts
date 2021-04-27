import styled from 'styled-components';
import { Text, Drop } from 'grommet';

const StyledDrop = styled(Drop)`
  z-index: 1000;
  margin-top: 5px;
  min-width: 5rem;
`;

const StyledDiv = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const StyledText = styled(Text)`
  cursor: pointer;
`;

export { StyledText, StyledDrop, StyledDiv };

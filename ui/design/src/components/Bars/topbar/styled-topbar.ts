import styled from 'styled-components';
import { Box, Text, Drop } from 'grommet';

const TopbarWrapper = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

const StyledText = styled(Text)`
  cursor: pointer;
`;

const StyledSearchContainer = styled(Box)`
  flex-grow: 1;
  max-width: 15rem;
`;

const StyledDrop = styled(Drop)`
  z-index: 1000;
  margin-top: 5px;
  min-width: 5rem;
`;

const StyledDiv = styled.div`
  cursor: pointer!;
`;

export { TopbarWrapper, StyledText, StyledSearchContainer, StyledDrop, StyledDiv };

import styled from 'styled-components';
import { Box, Text, Drop } from 'grommet';

const TopbarWrapper = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

const StyledText = styled(Text)`
  cursor: pointer;
  font-weight: 450;
`;

const StyledSearchContainer = styled(Box)`
  flex-grow: 1;
  align-items: flex-end;
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

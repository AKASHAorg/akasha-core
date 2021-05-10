import styled from 'styled-components';
import { Box } from 'grommet';

const TagIconDiv = styled.div<{ searchCard?: boolean }>`
  position: relative;
  top: ${props => (!props.searchCard ? '-1.875em' : '0')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => (!props.searchCard ? '80px' : '72px')};
  height: ${props => (!props.searchCard ? '80px' : '72px')};
  background-color: ${props => props.theme.colors.lightBackground};
  flex-shrink: 0;
`;

const StyledInlineBox = styled(Box)`
  display: inline-flex;
`;

export { TagIconDiv, StyledInlineBox };

import { Box, Drop } from 'grommet';
import styled from 'styled-components';

const StyledDrop = styled(Drop)`
  border-bottom-right-radius: ${props => props.theme.shapes.smallBorderRadius};
  border-top-right-radius: ${props => props.theme.shapes.smallBorderRadius};
  min-width: 10em;
  // background-color: ${props => props.theme.colors.mediumGrey};
`;

const StyledTitleBox = styled(Box)`
  height: 3em;
  border-top-right-radius: ${props => props.theme.shapes.smallBorderRadius};
  border-right: 1px solid ${props => props.theme.colors.border}
  border-top: 1px solid ${props => props.theme.colors.border}
`;

const StyledOptionsBox = styled(Box)`
border-bottom: 1px solid ${props => props.theme.colors.border}
border-right: 1px solid ${props => props.theme.colors.border}
border-bottom-right-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledOptionDiv = styled.div`
  display: flex;
  align-items: center;
  height: 3em;
`;

export { StyledDrop, StyledTitleBox, StyledOptionsBox, StyledOptionDiv };

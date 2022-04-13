import { Box } from 'grommet';
import styled from 'styled-components';

const BlueDot = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.accent};
`;

const StyledNotifBox = styled(Box)`
  cursor: pointer;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  &:hover {
    background-color: ${props => props.theme.colors.accentOpacity};
  }
`;

const IconDiv = styled(Box)`
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  &:hover {
    background-color: ${props => props.theme.colors.accentOpacity};
    div:nth-child(1) {
      & * {
        stroke: ${props => props.theme.colors.accent};
      }
    }
  }
`;

export { BlueDot, IconDiv, StyledNotifBox };

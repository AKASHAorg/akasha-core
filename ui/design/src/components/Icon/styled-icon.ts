import { Image } from 'grommet';
import styled from 'styled-components';

const StyledIconDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  cursor: pointer;
  background-color: ${props => props.theme.colors.lightBackground};
`;

const StyledImage = styled(Image)`
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
`;

export { StyledIconDiv, StyledImage };

import { TextInput } from 'grommet';
import styled from 'styled-components';

const StyledLinkIconDiv = styled.div`
  height: 32px;
  width: 32px;
  background-color: ${props => props.theme.colors.lightBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledTextInput = styled(TextInput)`
  padding: 0;
  height: 23px;

  font-family: ${props => props.theme.shapes.fontFamily};
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
  line-height: ${props => props.theme.shapes.fontSizes.large.height};
  color: ${props => props.theme.colors.primaryText};
`;

export { StyledLinkIconDiv, StyledTextInput };

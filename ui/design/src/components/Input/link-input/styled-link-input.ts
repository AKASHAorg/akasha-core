import { TextInput } from 'grommet';
import styled from 'styled-components';
// import { Button } from '../../Buttons/index';

const StyledLinkIconDiv = styled.div`
  height: 2rem;
  width: 2rem;
  background-color: ${props => props.theme.colors.lightBackground};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
`;

const StyledTextInput = styled(TextInput)`
  padding: 0;
  font-family: ${props => props.theme.shapes.fontFamily};
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
  line-height: ${props => props.theme.shapes.fontSizes.large.height};
  color: ${props => props.theme.colors.primaryText};
`;
const StyledInputWrapper = styled.div`
  width 77%;
`;
const StyledButton = styled.div`
  border-radius: 50%;
  height: 1.25rem;
  width: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.accent};
  cursor: pointer;
`;

export { StyledLinkIconDiv, StyledTextInput, StyledButton, StyledInputWrapper };

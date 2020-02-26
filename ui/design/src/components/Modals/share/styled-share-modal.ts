import { TextInput } from 'grommet';
import styled from 'styled-components';

const StyledIconDiv = styled.div`
  height: 2em;
  width: 2em;
  min-width: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.lightBackground};
  border-radius: ${props => props.theme.shapes.borderRadius};
`;

const StyledShareSocialDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2em;
  width: 2em;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.darkBlue};
  cursor: pointer;
  &:hover {
    background-color: ${props => props.theme.colors.accent};
  }
`;

const StyledTextInput = styled(TextInput)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  min-width: 15em;
`;

const StyledInputDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${props => props.theme.colors.border}
  border-radius: ${props => props.theme.shapes.borderRadius}

`;

export { StyledIconDiv, StyledShareSocialDiv, StyledTextInput, StyledInputDiv };

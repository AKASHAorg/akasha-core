import { TextInput } from 'grommet';
import styled from 'styled-components';
import { Icon } from '../../Icon';

const StyledTextInput = styled(TextInput)`
  padding: 0;
  font-family: ${props => props.theme.shapes.fontFamily};
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
  line-height: ${props => props.theme.shapes.fontSizes.large.height};
  color: ${props => props.theme.colors.primaryText};
`;

const StyledArrowIcon = styled(Icon)`
  color: ${props => props.theme.colors.primaryText};
`;

export { StyledTextInput, StyledArrowIcon };

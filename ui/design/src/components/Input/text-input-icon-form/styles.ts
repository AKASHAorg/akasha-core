import { Anchor, Box, TextInput } from 'grommet';
import styled from 'styled-components';
import { Icon } from '../../Icon';

const StyledTextInput = styled(TextInput)`
  padding: 0;
  font-family: ${props => props.theme.shapes.fontFamily};
  font-size: ${props => props.theme.shapes.fontSizes.large.size};
  line-height: ${props => props.theme.shapes.fontSizes.large.height};
  color: ${props => props.theme.colors.primaryText};
  font-weight: 400;
  &:disabled {
    color: ${props => props.theme.colors.primaryText};
    opacity: 0.9;
  }
`;

const StyledDisabledBox = styled(Box)`
  background-color: ${props => props.theme.colors.lightestGrey};
`;

const StyledDivider = styled(Box)`
  border-color: ${props => props.theme.colors.mediumGrey};
  min-width: 100%;
  padding: 0;
`;
const StyledArrowIcon = styled(Icon)`
  color: ${props => props.theme.colors.accent};
`;

const StyledAnchor = styled(Anchor)`
  color: ${props => props.theme.colors.accent};
  font-weight: ${props => props.theme.shapes.fontWeight.regular};
  &:hover {
    text-decoration: none;
  }
`;

export { StyledTextInput, StyledArrowIcon, StyledDisabledBox, StyledDivider, StyledAnchor };

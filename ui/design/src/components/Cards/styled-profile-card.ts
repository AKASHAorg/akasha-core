import { Text } from 'grommet';
import styled from 'styled-components';

const AvatarDiv = styled.div`
  position: relative;
  top: -1.875em;
`;

const ShareButtonContainer = styled.div`
  position: relative;
  top: 1em;
  right: 1em;
`;

const StyledActionText = styled(Text)`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

const StyledImageInput = styled.input`
  display: none;
`;

export { AvatarDiv, ShareButtonContainer, StyledActionText, StyledImageInput };

import styled from 'styled-components';
import { Text } from 'grommet';

const AvatarDiv = styled.div`
  box-sizing: border-box;
  border-radius: 100%;
  height: 84px;
  width: 84px;
  border: 4px solid #fff;
  transform: translateY(-30px);
  background-color: grey;
`;

const ShareButtonContainer = styled.div`
  position: relative;
  top: 16px;
  right: 16px;
`;

const StyledActionText = styled(Text)`
  cursor: pointer;
  &:hover {
    color: ${props => props.theme.colors.accent};
  }
`;

export { AvatarDiv, ShareButtonContainer, StyledActionText };

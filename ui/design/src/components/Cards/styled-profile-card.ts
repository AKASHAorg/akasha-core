import { Box, Text } from 'grommet';
import styled from 'styled-components';

const AvatarDiv = styled.div`
  position: relative;
  top: -30px;
`;

const ShareButtonContainer = styled(Box)`
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

const StyledImageInput = styled.input`
  display: none;
`;

const StyledEditCoverImageBox = styled(Box)`
  cursor: pointer;
`;

const StyledEditButtonsDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

const StyledCenterDiv = styled.div`
  display: flex;
  align-items: center;
`;

const StyledAvatarEditDiv = styled.div`
  border-radius: 100%;
  position: relative;
  left: 56px;
  bottom: 37px;
  border: 3px solid ${props => props.theme.colors.border};
  height: 24px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.border};
`;

export {
  AvatarDiv,
  ShareButtonContainer,
  StyledActionText,
  StyledImageInput,
  StyledEditCoverImageBox,
  StyledEditButtonsDiv,
  StyledCenterDiv,
  StyledAvatarEditDiv,
};

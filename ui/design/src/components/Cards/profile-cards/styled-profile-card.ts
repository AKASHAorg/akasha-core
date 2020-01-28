import { Box, Image } from 'grommet';
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
`;

const StyledAvatarEditDiv = styled.div`
  border-radius: 50%;
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

const StyledImage = styled(Image)`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

export {
  AvatarDiv,
  ShareButtonContainer,
  StyledEditCoverImageBox,
  StyledEditButtonsDiv,
  StyledCenterDiv,
  StyledAvatarEditDiv,
  StyledImage,
};

import { Box, Image } from 'grommet';
import styled from 'styled-components';

const AvatarDiv = styled.div`
  position: relative;
  top: -1.875em;
`;

const ShareButtonContainer = styled(Box)`
  position: relative;
  top: 1em;
  right: 1em;
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
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  cursor: pointer;
`;

const StyledAvatarEditDiv = styled.div`
  border-radius: 50%;
  position: relative;
  left: 3.5em;
  bottom: 2.313em;
  border: 3px solid ${props => props.theme.colors.border};
  height: 1.5em;
  width: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.border};
`;

const StyledImage = styled(Image)`
  width: 1.5em;
  height: 1.5em;
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

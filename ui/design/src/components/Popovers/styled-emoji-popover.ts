import { Box, Drop, Text } from 'grommet';
import styled from 'styled-components';

const StyledContentDiv = styled.div`
  height: 200px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const StyledList = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
`;

const StyledListElem = styled.span`
  cursor: pointer;
  font-size: 20px;
  width: 32px;
  height: 32px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.shapes.smallBorderRadius}
  :hover {
    background-color: rgba(78,113,255,0.2);
  }
`;

const StyledFooter = styled(Box)`
  background-color: ${props => props.theme.colors.lightBackground};
  height: 56px;
`;

const StyledCategoryContainer = styled.div`
  margin: ${props =>
    `0 ${props.theme.shapes.baseSpacing * 3}px ${props.theme.shapes.baseSpacing * 3}px`};
`;

const StyledSearchContainer = styled.div`
  margin: ${props => `${props.theme.shapes.baseSpacing}px ${props.theme.shapes.baseSpacing * 3}px`};
  height: 48px;
`;

const StyledEmojiDrop = styled(Drop)`
  width: 350px;
  margin-top: 5px;
  margin-left: -25px;
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
`;

const StyledHoveredEmoji = styled.div`
  padding: ${props => `0 ${props.theme.shapes.baseSpacing * 3}px`}
  font-size: 20px;
`;

const StyledHoveredEmojiName = styled.div`
padding: ${props => `0 ${props.theme.shapes.baseSpacing * 3}px 0 0`}
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const StyledCategoryText = styled(Text)`
  text-transform: capitalize;
`;

export {
  StyledCategoryContainer,
  StyledContentDiv,
  StyledEmojiDrop,
  StyledFooter,
  StyledList,
  StyledListElem,
  StyledSearchContainer,
  StyledHoveredEmoji,
  StyledHoveredEmojiName,
  StyledCategoryText,
};

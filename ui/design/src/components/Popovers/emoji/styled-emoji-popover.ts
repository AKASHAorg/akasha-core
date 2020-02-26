import { Box, Drop, Text } from 'grommet';
import styled from 'styled-components';

const StyledContentDiv = styled.div`
  height: 12.5em;
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
  font-size: 1.25em;
  width: 2em;
  height: 2em;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.shapes.smallBorderRadius};
  :hover {
    background-color: rgba(78, 113, 255, 0.2);
  }
`;

const StyledFooter = styled(Box)`
  background-color: ${props => props.theme.colors.lightBackground};
  height: 3.5em;
`;

const StyledCategoryContainer = styled.div`
  margin: ${props =>
    `0 ${props.theme.shapes.baseSpacing * 3}px ${props.theme.shapes.baseSpacing * 3}px`};
`;

const StyledSearchContainer = styled.div`
  margin: ${props => `${props.theme.shapes.baseSpacing}px ${props.theme.shapes.baseSpacing * 3}px`};
  height: 3em;
`;

const StyledEmojiDrop = styled(Drop)`
  width: 21.875em;
  margin-top: 0.313em;
  margin-left: -1.563em;
  border: 1px solid ${props => props.theme.colors.border}
  border-radius: ${props => props.theme.shapes.largeBorderRadius};
`;

const StyledHoveredEmoji = styled.div`
  padding: ${props => `0 ${props.theme.shapes.baseSpacing * 3}px`};
  font-size: 1.25em;
`;

const StyledHoveredEmojiName = styled.div`
  padding: ${props => `0 ${props.theme.shapes.baseSpacing * 3}px 0 0`};
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

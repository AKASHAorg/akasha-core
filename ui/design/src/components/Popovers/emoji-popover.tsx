import { Box, Text } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';
import { Icon } from '../Icon/index';
import { StyledSearchBox, StyledTextInput } from '../Input/styled-input';
import BasicPopover from './basic-popover';
import { emojis } from './emojis';
import { groups } from './groups';

interface IEmojiPopover {
  className?: string;
  onClickEmoji: (emojiCode: string) => void;
  target: React.RefObject<any>;
  closePopover: () => void;
}

const StyledContentDiv = styled.div`
  height: 300px;
  overflow: auto;
  display: flex;
  flex-direction: column;
`;

const StyledList = styled.div`
  clear: both;
  margin: 0;
  list-style: none;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
`;

const StyledListElem = styled.span`
  position: relative;
  cursor: pointer;
`;

const StyledFooter = styled.div`
  background-color: ${props => props.theme.colors.lightBackground};
  height: 56px;
`;

const StyledCategoryContainer = styled.div`
  margin: ${props => `${props.theme.shapes.baseSpacing * 3}px`};
`;

const EmojiPopover: React.FC<IEmojiPopover> = props => {
  const { className, closePopover, target, onClickEmoji } = props;

  const [inputValue, setInputValue] = React.useState('');
  const [hoveredEmoji, setHoveredEmoji] = React.useState({ emojiCode: '', emojiName: '' });

  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(ev.target.value);
  };

  const handleEmojiMouseEnter = (emojiCode: string, emojiName: string) => () => {
    setHoveredEmoji({ emojiCode, emojiName });
  };

  const handleEmojiMouseLeave = () => {
    setHoveredEmoji({ emojiCode: '', emojiName: '' });
  };

  const handleEmojiClick = (emojiCode: string) => () => {
    onClickEmoji(emojiCode);
    closePopover();
  };

  const renderEmoji = (elem: { n: string[]; u: string }, index: number) => {
    const emojiCode = elem.u
      .split('-')
      .map(hex => parseInt(hex, 16))
      .map(hex => String.fromCodePoint(hex))
      .join('');
    const emojiName = elem.n[0];
    return (
      <StyledListElem
        key={index}
        onMouseEnter={handleEmojiMouseEnter(emojiCode, emojiName)}
        onMouseLeave={handleEmojiMouseLeave}
        onClick={handleEmojiClick(emojiCode)}
      >
        {emojiCode}
      </StyledListElem>
    );
  };

  const renderCategory = (categoryName: string) => {
    return (
      <StyledCategoryContainer>
        <Text size="large">{categoryName}</Text>
        <StyledList>
          {emojis[categoryName].map((elem: { n: string[]; u: string }, index: number) =>
            renderEmoji(elem, index),
          )}
        </StyledList>
      </StyledCategoryContainer>
    );
  };

  return (
    <BasicPopover closePopover={closePopover} target={target} gap={'-5px'} className={className}>
      <Box pad="xsmall">
        <StyledSearchBox
          fill="horizontal"
          direction="row"
          align="center"
          pad={{ horizontal: 'medium', vertical: 'xsmall' }}
          round="small"
          border={{
            side: 'all',
            color: 'border',
          }}
          className={className}
          gap="xsmall"
        >
          <Icon type="search" />
          <StyledTextInput
            plain={true}
            value={inputValue}
            onChange={onChange}
            placeholder={'Search'}
          />
        </StyledSearchBox>
      </Box>
      <StyledContentDiv>
        {groups.map((categoryName: string) => renderCategory(categoryName))}
      </StyledContentDiv>
      <StyledFooter>
        <Box>{hoveredEmoji.emojiCode}</Box>
        <Box>{hoveredEmoji.emojiName}</Box>
      </StyledFooter>
    </BasicPopover>
  );
};

export default EmojiPopover;

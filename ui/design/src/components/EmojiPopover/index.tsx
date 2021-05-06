import * as React from 'react';
import Icon from '../Icon';
import { StyledSearchBox, StyledTextInput } from '../DropSearchInput/drop-styled-search-input';
import { emojis } from './emojis';
import { groups } from './groups';
import {
  StyledCategoryContainer,
  StyledCategoryText,
  StyledContentDiv,
  StyledEmojiDrop,
  StyledFooter,
  StyledHoveredEmoji,
  StyledHoveredEmojiName,
  StyledList,
  StyledListElem,
  StyledSearchContainer,
} from './styled-emoji-popover';

export interface IEmojiPopover {
  className?: string;
  onClickEmoji: (emojiCode: string) => void;
  target: HTMLElement;
  closePopover: () => void;
}

export interface IEmojiData {
  n: string[];
  u: string;
  v?: string[];
}

const EmojiPopover: React.FC<IEmojiPopover> = props => {
  const { className, closePopover, target, onClickEmoji } = props;

  const [searchValue, setSearchValue] = React.useState('');
  const [hoveredEmoji, setHoveredEmoji] = React.useState({ emojiCode: '', emojiName: '' });

  const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(ev.target.value);
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

  const renderEmoji = (elem: IEmojiData, index: number) => {
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
      <StyledCategoryContainer key={categoryName}>
        <StyledCategoryText size="large">{categoryName}</StyledCategoryText>
        <StyledList>
          {emojis[categoryName].map((elem: IEmojiData, index: number) => renderEmoji(elem, index))}
        </StyledList>
      </StyledCategoryContainer>
    );
  };

  const renderSearchContent = () => (
    <StyledCategoryContainer>
      <StyledList>
        {Object.values(emojis).map((group: any) =>
          group
            .filter(
              (elem: IEmojiData) => elem.n[0].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0,
            )
            .map((elem: IEmojiData, index: number) => renderEmoji(elem, index)),
        )}
      </StyledList>
    </StyledCategoryContainer>
  );

  const renderContent = () => {
    if (searchValue) {
      return renderSearchContent();
    }
    return groups.map((categoryName: string) => renderCategory(categoryName));
  };

  return (
    <StyledEmojiDrop
      target={target}
      overflow="hidden"
      align={{ top: 'bottom', left: 'left' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
    >
      <StyledSearchContainer>
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
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={'Search'}
          />
        </StyledSearchBox>
      </StyledSearchContainer>
      <StyledContentDiv>{renderContent()}</StyledContentDiv>
      <StyledFooter direction="row" align="center" border={{ side: 'top', color: 'border' }}>
        <StyledHoveredEmoji>{hoveredEmoji.emojiCode}</StyledHoveredEmoji>
        <StyledHoveredEmojiName>{hoveredEmoji.emojiName}</StyledHoveredEmojiName>
      </StyledFooter>
    </StyledEmojiDrop>
  );
};

export default EmojiPopover;

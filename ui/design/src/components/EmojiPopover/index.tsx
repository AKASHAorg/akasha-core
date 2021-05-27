import * as React from 'react';

import Icon from '../Icon';
import { RenderContent } from './RenderContent';
import { IRenderEmojiProps } from './RenderEmoji';

import { StyledSearchBox, StyledTextInput } from '../DropSearchInput/drop-styled-search-input';
import {
  StyledContentDiv,
  StyledEmojiDrop,
  StyledFooter,
  StyledHoveredEmoji,
  StyledHoveredEmojiName,
  StyledSearchContainer,
} from './styled-emoji-popover';

export interface IEmojiPopover extends Pick<IRenderEmojiProps, 'onClickEmoji' | 'closePopover'> {
  className?: string;
  target: HTMLElement;
  emojiPlaceholderLabel?: string;
}

const EmojiPopover: React.FC<IEmojiPopover> = props => {
  const { className, target, emojiPlaceholderLabel, closePopover, onClickEmoji } = props;

  const [searchValue, setSearchValue] = React.useState('');
  const [hoveredEmoji, setHoveredEmoji] = React.useState({ emojiCode: '', emojiName: '' });

  const handleSearchChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(ev.target.value);
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
            placeholder={emojiPlaceholderLabel}
          />
        </StyledSearchBox>
      </StyledSearchContainer>
      <StyledContentDiv>
        {RenderContent({ searchValue, onClickEmoji, setHoveredEmoji, closePopover })}
      </StyledContentDiv>
      <StyledFooter direction="row" align="center" border={{ side: 'top', color: 'border' }}>
        <StyledHoveredEmoji>{hoveredEmoji.emojiCode}</StyledHoveredEmoji>
        <StyledHoveredEmojiName>{hoveredEmoji.emojiName}</StyledHoveredEmojiName>
      </StyledFooter>
    </StyledEmojiDrop>
  );
};

EmojiPopover.defaultProps = {
  emojiPlaceholderLabel: 'Search',
};

export default EmojiPopover;

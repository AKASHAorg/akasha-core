import React from 'react';

import { IEmojiData, IRenderEmojiProps, RenderEmoji } from './RenderEmoji';

import { emojis } from './emojis';
import { StyledCategoryContainer, StyledCategoryText, StyledList } from './styled-emoji-popover';

export interface IRenderCategoryProps
  extends Pick<IRenderEmojiProps, 'onClickEmoji' | 'setHoveredEmoji' | 'closePopover'> {
  categoryName: string;
}

const RenderCategory: React.FC<IRenderCategoryProps> = props => {
  const { categoryName, onClickEmoji, setHoveredEmoji, closePopover } = props;

  return (
    <StyledCategoryContainer key={categoryName}>
      <StyledCategoryText size="large">{categoryName}</StyledCategoryText>
      <StyledList>
        {emojis[categoryName].map((elem: IEmojiData, index: number) => (
          <RenderEmoji
            key={index}
            elem={elem}
            index={index}
            onClickEmoji={onClickEmoji}
            setHoveredEmoji={setHoveredEmoji}
            closePopover={closePopover}
          />
        ))}
      </StyledList>
    </StyledCategoryContainer>
  );
};

export { RenderCategory };

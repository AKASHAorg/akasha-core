import React from 'react';

import { IEmojiData, IRenderEmojiProps, RenderEmoji } from './RenderEmoji';

import { emojis } from './emojis';
import { StyledCategoryContainer, StyledList } from './styled-emoji-popover';

export interface IRenderSearchContentProps
  extends Pick<IRenderEmojiProps, 'onClickEmoji' | 'setHoveredEmoji' | 'closePopover'> {
  searchValue: string;
}

const RenderSearchContent: React.FC<IRenderSearchContentProps> = props => {
  const { searchValue, onClickEmoji, setHoveredEmoji, closePopover } = props;

  return (
    <StyledCategoryContainer>
      <StyledList>
        {Object.values(emojis).map((group: any) =>
          group
            .filter(
              (elem: IEmojiData) => elem.n[0].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0,
            )
            .map((elem: IEmojiData, index: number) => (
              <RenderEmoji
                key={index}
                elem={elem}
                index={index}
                onClickEmoji={onClickEmoji}
                setHoveredEmoji={setHoveredEmoji}
                closePopover={closePopover}
              />
            )),
        )}
      </StyledList>
    </StyledCategoryContainer>
  );
};

export { RenderSearchContent };

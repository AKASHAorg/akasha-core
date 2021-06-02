import React from 'react';

import { RenderCategory } from './RenderCategory';
import { IRenderSearchContentProps, RenderSearchContent } from './RenderSearchContent';

import { groups } from './groups';

const RenderContent = (props: IRenderSearchContentProps) => {
  const { searchValue, onClickEmoji, setHoveredEmoji, closePopover } = props;

  if (searchValue) {
    return (
      <RenderSearchContent
        searchValue={searchValue}
        onClickEmoji={onClickEmoji}
        setHoveredEmoji={setHoveredEmoji}
        closePopover={closePopover}
      />
    );
  }
  return groups.map((categoryName: string, index: number) => (
    <RenderCategory
      key={index}
      categoryName={categoryName}
      onClickEmoji={onClickEmoji}
      setHoveredEmoji={setHoveredEmoji}
      closePopover={closePopover}
    />
  ));
};

export { RenderContent };

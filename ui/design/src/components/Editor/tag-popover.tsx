import * as React from 'react';
import { Portal } from './helpers';
import { Text } from 'grommet';
import { StyledPopoverDiv, StyledPopoverValueBox } from './styled-editor-box';
import { ITag } from '@akashaorg/typings/ui';

export interface ITagPopover {
  postsLabel?: string;
  values: ITag[];
  ref: React.Ref<HTMLDivElement>;
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
}

export const TagPopover: React.FC<ITagPopover> = React.forwardRef((props, ref) => {
  const { postsLabel, values, currentIndex, setIndex, handleSelect } = props;

  return (
    <Portal>
      <StyledPopoverDiv ref={ref}>
        {values.map((value, i) => (
          <StyledPopoverValueBox
            pad="small"
            key={i}
            selectedBackground={i === currentIndex}
            onClick={() => {
              handleSelect(i);
            }}
            onMouseEnter={() => {
              setIndex(i);
            }}
          >
            <Text size="medium" color="primaryText">{`#${value.name}`}</Text>
            <Text size="small" color="secondaryText">
              {`${value.totalPosts} ${postsLabel}`}
            </Text>
          </StyledPopoverValueBox>
        ))}
      </StyledPopoverDiv>
    </Portal>
  );
});

TagPopover.displayName = 'TagPopover';

TagPopover.defaultProps = {
  postsLabel: 'posts',
};

import * as React from 'react';
import { Tag } from '@akashaorg/typings/lib/ui';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Portal } from './helpers';

export interface ITagPopover {
  postsLabel?: string;
  values: Tag[];
  currentIndex: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  handleSelect: (index: number) => void;
}

export const TagPopover = React.forwardRef<HTMLDivElement, ITagPopover>((props, ref) => {
  const { postsLabel = 'posts', values, currentIndex, setIndex, handleSelect } = props;

  return (
    <Portal>
      <div
        className={`absolute -top-[9999px] -left-[9999px] z-50 p-1 bg-grey9 bg-grey1 rounded-[0.5rem] border-grey8 dark:border-grey8`}
        ref={ref}
      >
        {values.map((value, i) => (
          <button
            key={i}
            onClick={() => {
              handleSelect(i);
            }}
            onMouseEnter={() => {
              setIndex(i);
            }}
          >
            <div
              className={`p-2 cursor-pointer p-1 rounded-[0.125rem] max-w-xs min-w-[12rem] truncate hover:text-secondaryLight dark:hover:text-secondaryDark ${
                i === currentIndex && 'bg-grey3'
              }`}
            >
              <Typography>{`#${value.name}`}</Typography>
              <Typography className="text-sm font-light">{`${value.totalPosts} ${postsLabel}`}</Typography>
            </div>
          </button>
        ))}
      </div>
    </Portal>
  );
});

TagPopover.displayName = 'TagPopover';

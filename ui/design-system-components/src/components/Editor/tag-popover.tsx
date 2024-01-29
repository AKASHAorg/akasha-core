import * as React from 'react';
import { ITag } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Portal } from './helpers';
import { tw, tx } from '@twind/core';

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
      <div
        className={tw(
          `absolute -top-[9999px] -left-[9999px] z-50 p-1 bg(grey9 dark: grey1) rounded-lg border(grey8 dark:grey8)`,
        )}
        ref={ref}
      >
        {values.map((value, i) => (
          <Button
            key={i}
            plain={true}
            onClick={() => {
              handleSelect(i);
            }}
            onMouseEnter={() => {
              setIndex(i);
            }}
          >
            <div
              className={tx(
                `p-2 cursor-pointer p-1 rounded-sm max-w-xs min-w-[12rem] truncate hover:text(secondaryLight dark:secondaryDark) ${
                  i === currentIndex && 'bg-grey3'
                }`,
              )}
            >
              <Text>{`#${value.name}`}</Text>
              <Text customStyle={'text-sm'} variant={'subtitle1'}>
                {`${value.totalPosts} ${postsLabel}`}
              </Text>
            </div>
          </Button>
        ))}
      </div>
    </Portal>
  );
});

TagPopover.displayName = 'TagPopover';

TagPopover.defaultProps = {
  postsLabel: 'posts',
};

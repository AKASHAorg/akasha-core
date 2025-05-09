import * as React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { RssIcon } from 'lucide-react';

export interface ITagButton {
  tagName: string;
  isSubscribed?: boolean;
  onClickTag?: () => void;
}
export const TagButton: React.FC<ITagButton> = props => {
  const { tagName, isSubscribed, onClickTag } = props;
  const bgClass = isSubscribed
    ? 'secondaryLight dark:secondaryDark'
    : 'secondaryLight/60 dark:secondaryDark/60';
  const flexClass = ' flex flex-row items-center justify-center';
  return (
    <button
      className={`max-w-[150px] border-grey8 dark:border-grey3 rounded-[0.5rem] px-4 py-1 gap-2 ${bgClass} ${flexClass}`}
      onClick={onClickTag}
    >
      <Typography className="truncate">{tagName}</Typography>
      <RssIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
    </button>
  );
};

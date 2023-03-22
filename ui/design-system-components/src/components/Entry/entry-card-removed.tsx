import * as React from 'react';
import { tw } from '@twind/core';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export interface IEntryCardRemoved {
  isAuthor: boolean;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
}

const EntryCardRemoved: React.FC<IEntryCardRemoved> = props => {
  const { isAuthor, removedByAuthorLabel, removedByMeLabel } = props;
  return (
    <div className={tw(`flex px-4 my-2`)}>
      <div className={tw(`p-4 rounded-xs border border-grey8 border-dashed`)}>
        <div className={tw(`flex flex-row items-center`)}>
          <Icon type="TrashIcon" />
          <div className={tw(`ml-2`)}>
            {isAuthor ? `${removedByMeLabel}.` : `${removedByAuthorLabel}.`}
          </div>
        </div>
      </div>
    </div>
  );
};

export { EntryCardRemoved };

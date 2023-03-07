import * as React from 'react';
import { tw } from '@twind/core';
import DS from '@akashaorg/design-system-core';
import { IEntryData } from '@akashaorg/typings/ui';
import ReadOnlyEditor from '../ReadOnlyEditor';

const { ProfileAvatarButton } = DS;

export interface IEmbedEntryBox {
  embedEntryData: IEntryData;
}

const EmbedBox: React.FC<IEmbedEntryBox> = props => (
  <div className={tw(`flex p-4 gap-4 rounded-xs bg(grey8 dark:grey1)`)} data-testid="embed-box">
    <ProfileAvatarButton
      label={props.embedEntryData.author?.name}
      info={props.embedEntryData.author?.userName && `@${props.embedEntryData.author?.userName}`}
      avatarImage={props.embedEntryData.author?.avatar}
      ethAddress={props.embedEntryData.author?.ethAddress}
    />

    <div className={tw(`flex`)}>
      <ReadOnlyEditor content={props.embedEntryData.slateContent} />
    </div>
  </div>
);

export default EmbedBox;

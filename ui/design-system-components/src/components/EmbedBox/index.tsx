import React from 'react';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import ReadOnlyEditor from '../ReadOnlyEditor';
import { tw } from '@twind/core';
import { IEntryData, type Image } from '@akashaorg/typings/lib/ui';

export interface IEmbedEntryBox {
  embedEntryData: IEntryData;
  transformSource: (src: Image) => Image;
}

const EmbedBox: React.FC<IEmbedEntryBox> = props => (
  <div
    className={tw(
      `flex flex-col justify-items-start p-4 gap-4 rounded-lg bg(grey8 dark:grey1) w-full`,
    )}
    data-testid="embed-box"
  >
    <ProfileAvatarButton
      label={props.embedEntryData.author?.name}
      avatar={props.transformSource(props.embedEntryData.author?.avatar?.default)}
      alternativeAvatars={props.embedEntryData.author?.avatar?.alternatives?.map(alternative =>
        props.transformSource(alternative),
      )}
      profileId={props.embedEntryData.author?.did?.id}
    />

    <div className={tw(`flex`)}>
      <ReadOnlyEditor content={props.embedEntryData.slateContent} />
    </div>
  </div>
);

export default EmbedBox;

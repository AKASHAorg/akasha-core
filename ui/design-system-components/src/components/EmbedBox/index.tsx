import React from 'react';
import ProfileAvatarButton from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton';
import ReadOnlyEditor from '../ReadOnlyEditor';
import { tw } from '@twind/core';
import { AkashaProfile, type Image } from '@akashaorg/typings/lib/ui';
import { Descendant } from 'slate';

export interface IEmbedEntryBox {
  embedEntryAuthorData: AkashaProfile;
  slateContent: Descendant[];
  transformSource: (src: Image) => Image;
}

const EmbedBox: React.FC<IEmbedEntryBox> = props => {
  const { embedEntryAuthorData, transformSource, slateContent } = props;
  return (
    <div
      className={tw(
        `flex flex-col justify-items-start p-4 gap-4 rounded-lg bg(grey8 dark:grey1) w-full`,
      )}
      data-testid="embed-box"
    >
      <ProfileAvatarButton
        label={embedEntryAuthorData?.name}
        avatar={transformSource(embedEntryAuthorData?.avatar?.default)}
        alternativeAvatars={embedEntryAuthorData?.avatar?.alternatives?.map(alternative =>
          transformSource(alternative),
        )}
        profileId={embedEntryAuthorData?.did?.id}
      />

      <div className={tw(`flex`)}>
        <ReadOnlyEditor content={slateContent} />
      </div>
    </div>
  );
};

export default EmbedBox;

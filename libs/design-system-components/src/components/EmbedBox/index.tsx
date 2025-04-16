import React from 'react';
import ReadOnlyEditor from '../ReadOnlyEditor';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

import { AkashaProfile, type Image } from '@akashaorg/typings/lib/ui';
import { Descendant } from 'slate';

export interface IEmbedEntryBox {
  embedEntryAuthorData: AkashaProfile;
  slateContent: Descendant[];
  transformSource: (src: Image) => Image;
}

/**
 * Component used to display an embeded slate content block in order to repost content
 * @param embedEntryAuthorData - profile data of the original post that is being embeded
 * @param transformSource - utility function to provide ipfs images with gateways to be accessed
 * @param slateContent - text content in the slate.js format
 */
const EmbedBox: React.FC<IEmbedEntryBox> = props => {
  const { embedEntryAuthorData, transformSource, slateContent } = props;
  return (
    <div
      className={`flex flex-col justify-items-start p-4 gap-4 rounded-[0.5rem] bg(grey8 dark:grey1) w-full`}
      data-testid="embed-box"
    >
      <ProfileAvatarButton profileDID={embedEntryAuthorData?.did?.id}>
        <ProfileAvatarButtonAvatar>
          <ProfileAvatarButtonAvatarImage
            src={
              transformSource(embedEntryAuthorData?.avatar?.default)?.src ||
              embedEntryAuthorData?.avatar?.alternatives?.map(alternative =>
                transformSource(alternative),
              )?.[0]?.src
            }
            alt="Author Avatar"
          />
          <ProfileAvatarButtonAvatarFallback />
        </ProfileAvatarButtonAvatar>
        <ProfileName>{embedEntryAuthorData?.name}</ProfileName>
        <ProfileDidField />
      </ProfileAvatarButton>

      <div className={`flex`}>
        <ReadOnlyEditor content={slateContent} />
      </div>
    </div>
  );
};

export default EmbedBox;

import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';

const { EntryCard } = DS;

export interface IFeedItemProps {
  item: any;
  className?: string;
}

export const FeedItem: React.FC<IFeedItemProps> = (props) => {
  const [profileState, profileActions] = useProfile();
  const { t } = useTranslation();

  profileActions.getFeedItemData({ entryId: props.item.id });

  const itemData = profileState.feedItems.find(item => item.entryId === props.item.id);

  if (!itemData) {
    return null;
  }

  return (
      <EntryCard
        isBookmarked={false}
        entryData={itemData}
        onClickAvatar={() => {}}
        repliesLabel={t('Replies', { count: 1 })}
        repostsLabel={t('Reposts', { count: 0 })}
        shareLabel={t('Share')}
        copyLinkLabel={t('Copy Link')}
        copyIPFSLinkLabel={t('Copy IPFS Link')}
        flagAsLabel={t('Flag as inappropiate')}
        loggedProfileEthAddress={'0x00123'}
        locale={'en'}
        style={{ height: 'auto' }}
        bookmarkLabel={t('Save')}
        bookmarkedLabel={t('Saved')}
        onRepost={() => {}}
        onEntryShare={() => {}}
        onEntryFlag={() => {}}
        onLinkCopy={() => {}}
      />
  );
};

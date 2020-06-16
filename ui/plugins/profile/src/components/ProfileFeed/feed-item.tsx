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
        entryData={itemData}
        onClickAvatar={() => {}}
        repostsLabel={t('Quotes')}
        shareLabel={t('Share')}
        editPostLabel={t('Edit Post')}
        copyLinkLabel={t('Copy link')}
        repliesLabel={t('Replies', { count: 10 })}
        loggedProfileAvatar={itemData.avatar}
        loggedProfileEthAddress={itemData.ethAddress}
        locale={'en'}
        className={props.className}
        isBookmarked={false}
        onEntryBookmark={() => {}}
        onEntryFlag={() => {}}
        onEntryShare={() => {}}
        bookmarkLabel={t('Save')}
        bookmarkedLabel={t('Saved')}
        onRepost={() => {}}
        onLinkCopy={() => {}}
      />
  );
};

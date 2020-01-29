import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { useProfile } from '../../state/profiles';

const { EntryCard } = DS;

export interface FeedItemProps {
  item: any;
}

export const FeedItem = (props: FeedItemProps) => {
  const [profileState, profileActions] = useProfile();
  const { t } = useTranslation();
  profileActions.getFeedItemData({ entryId: props.item.id });

  const itemData = profileState.feedItems.find(item => item.entryId === props.item.id);

  if (!itemData) {
    return null;
  }

  return (
    <div>
      <EntryCard
        entryData={itemData}
        onClickAvatar={() => {}}
        onClickDownvote={() => {}}
        onClickUpvote={() => {}}
        commentsLabel={t('Comments')}
        quotesLabel={t('Quotes')}
        shareLabel={t('Share')}
        editPostLabel={t('Edit Post')}
        editCommentLabel={t('Edit Comment')}
        copyLinkLabel={t('Copy link')}
        quotedByLabel={t('Quoted By')}
        replyLabel={t('Reply')}
        commentInputPlaceholderLabel={t('Write a comment')}
        commentInputPublishLabel={t('Publish')}
        publishComment={() => {}}
        loggedProfileAvatar={itemData.avatar}
        loggedProfileEthAddress={itemData.ethAddress}
        locale={'en'}
      />
    </div>
  );
};

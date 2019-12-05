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
  const [t] = useTranslation();
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
        commentsTitle={t('Comments')}
        quotesTitle={t('Quotes')}
        shareTitle={t('Share')}
        editPostTitle={t('Edit Post')}
        editCommentTitle={t('Edit Comment')}
        copyLinkTitle={t('Copy link')}
        quotedByTitle={t('Quoted By')}
        replyTitle={t('Reply')}
        commentInputPlaceholderTitle={t('Write a comment')}
        commentInputPublishTitle={t('Publish')}
        publishComment={() => {}}
        loggedProfileAvatar={itemData.avatar}
        loggedProfileEthAddress={itemData.ethAddress}
        locale={'en'}
      />
    </div>
  );
};

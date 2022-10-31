import * as React from 'react';
import DS from '@akashaorg/design-system';
import {
  uploadMediaToTextile,
  getLinkPreview,
  useTagSearch,
  useMentionSearch,
  useGetProfile,
  useGetLogin,
} from '@akashaorg/ui-awf-hooks';
import { useTranslation } from 'react-i18next';
import { IEditorBox } from '@akashaorg/design-system/lib/components/Editor';
import { IEntryData, RootExtensionProps } from '@akashaorg/typings/ui';

const { CommentEditor, EntryCardLoading } = DS;

export function Base(
  props: Partial<IEditorBox> & {
    isShown: boolean;
    singleSpa: RootExtensionProps['singleSpa'];
    entryData: IEntryData;
  },
) {
  const { t } = useTranslation('app-akasha-integration');

  const loginQuery = useGetLogin();
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  /* @Todo: fix my type ;/ */
  const tagSearch: any = useTagSearch(tagQuery);

  const profileDataReq = useGetProfile(loginQuery.data?.pubKey);

  const disablePublishing = React.useMemo(
    () => loginQuery.data.waitForAuth || !loginQuery.data.isReady,
    [loginQuery.data],
  );

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };

  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  if (profileDataReq.status === 'loading') return <EntryCardLoading />;

  if (profileDataReq.status === 'error') return <>Error occured</>;

  return (
    profileDataReq.status === 'success' && (
      <CommentEditor
        {...props}
        onPublish={data => {
          if (!profileDataReq.data) {
            return;
          }
          props.onPublish(data);
        }}
        linkPreview={props.entryData?.linkPreview}
        uploadedImages={props.entryData?.images}
        onCancelClick={() => props.singleSpa.navigateToUrl(location.pathname)}
        cancelButtonLabel={t('Cancel')}
        avatar={profileDataReq.data?.avatar}
        ethAddress={loginQuery.data?.ethAddress}
        emojiPlaceholderLabel={t('Search')}
        disablePublishLabel={t('Authenticating')}
        disablePublish={disablePublishing}
        getLinkPreview={getLinkPreview}
        getMentions={handleMentionQueryChange}
        getTags={handleTagQueryChange}
        tags={tagSearch.data}
        mentions={mentionSearch.data}
        uploadRequest={uploadMediaToTextile}
        background="cardBackground"
      />
    )
  );
}

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
import { IReplyErrorState, ReplyError } from './reply-error';

const { CommentEditor, EntryCardLoading } = DS;

export function Base(
  props: Partial<IEditorBox> & {
    isShown: boolean;
    singleSpa: RootExtensionProps['singleSpa'];
    entryData: IEntryData;
    isReply: boolean;
  },
) {
  const { t } = useTranslation('app-akasha-integration');

  const [replyState, setReplyState] = React.useState<IReplyErrorState>();

  const loginQuery = useGetLogin();
  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = useMentionSearch(mentionQuery);
  const tagSearch = useTagSearch(tagQuery);

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
    <>
      {profileDataReq.status === 'success' && (!replyState || replyState.state === 'retry') && (
        <CommentEditor
          {...props}
          editorState={
            replyState && replyState.state === 'retry' ? replyState.content : props.editorState
          }
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
          background={props.entryData ? 'entryEditorBackground' : 'cardBackground'}
        />
      )}
      {props.isReply && (
        <ReplyError
          postId={props.entryData?.postId}
          pubKey={profileDataReq?.data?.pubKey}
          onChange={({ state, content }) => {
            switch (state) {
              case 'error':
                setReplyState({ state });
                break;
              case 'retry':
                setReplyState({ state, content });
                break;
            }
          }}
        />
      )}
    </>
  );
}

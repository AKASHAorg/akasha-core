import * as React from 'react';
import { getLinkPreview } from '@akashaorg/ui-awf-hooks';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { IEntryData, RootExtensionProps } from '@akashaorg/typings/lib/ui';
import { IReplyErrorState, ReplyError } from './reply-error';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import ReflectionEditor, {
  ReflectionEditorProps,
} from '@akashaorg/design-system-components/lib/components/ReflectionEditor';

export function Base(
  props: Partial<ReflectionEditorProps> & {
    singleSpa: RootExtensionProps['singleSpa'];
    entryData: IEntryData;
    isReply: boolean;
  },
) {
  const { t } = useTranslation('app-akasha-integration');

  const [replyState, setReplyState] = React.useState<IReplyErrorState>();

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionSearch = null;
  const tagSearch = null;

  const disablePublishing = React.useMemo(() => !loggedProfileData?.did?.id, [loggedProfileData]);

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
        <ReflectionEditor
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
          setEditorState={props.setEditorState}
          onCancelClick={() => props.singleSpa.navigateToUrl(location.pathname)}
          cancelButtonLabel={t('Cancel')}
          avatar={profileDataReq?.data?.avatar}
          profileId={loggedProfileData?.did?.id}
          emojiPlaceholderLabel={t('Search')}
          disablePublishLabel={t('Authenticating')}
          disablePublish={disablePublishing}
          getLinkPreview={getLinkPreview}
          getMentions={handleMentionQueryChange}
          getTags={handleTagQueryChange}
          tags={tagSearch?.data}
          mentions={mentionSearch?.data}
          background={props.entryData && { light: 'grey9', dark: 'grey3' }}
        />
      )}
      {props.isReply && (
        <ReplyError
          postId={props.entryData?.postId}
          loggedProfileData={loggedProfileData}
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

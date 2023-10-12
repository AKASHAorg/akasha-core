import React, { useMemo, useState } from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import {
  getLinkPreview,
  serializeSlateToBase64,
  useAnalytics,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  useGetMyProfileQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData } from '@akashaorg/typings/lib/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';

type ReflectionEditorProps = {
  beamId: string;
  action: 'edit' | 'reflect';
};

export const ReflectionEditor: React.FC<ReflectionEditorProps> = props => {
  const { action, beamId } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { singleSpa } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();

  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [editorState, setEditorState] = useState(null);

  const mentionSearch = null;
  const tagSearch = null;

  // @TODO replace with new hooks
  const reflect = undefined;
  const publishReflect = useCreateReflectMutation({
    onSuccess: () => {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
  });

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });

  const loggedProfileData = profileDataReq.data;
  const disablePublishing = useMemo(() => !loggedProfileData?.did?.id, [loggedProfileData]);

  const handlePublish = React.useCallback(
    (data: IPublishData) => {
      switch (action) {
        case 'edit':
          /* @TODO */
          break;
        case 'reflect':
          publishReflect.mutate({
            i: {
              content: {
                active: true,
                beamID: beamId,
                content: [
                  {
                    label: data.metadata.app,
                    propertyType: 'slate-block',
                    value: serializeSlateToBase64(data.slateContent),
                  },
                ],
                createdAt: new Date().toISOString(),
                isReply: true,
              },
            },
          });
          break;
      }

      singleSpa.navigateToUrl(location.pathname);
    },
    [action, beamId, publishReflect, singleSpa],
  );

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };

  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  // @TODO: fix author name
  const entryAuthorName = undefined;
  // entryData?.author?.name || entryData?.author?.userName || entryData?.author?.ethAddress;

  if (profileDataReq.status === 'loading') return <EntryCardLoading />;

  if (profileDataReq.status === 'error')
    return (
      <ErrorLoader
        type="script-error"
        title={t('There was an error loading the editor')}
        details={t('We cannot show this entry right now')}
        devDetails={profileDataReq.error as string}
      />
    );

  return (
    <>
      <Editor
        postLabel={t('Reflect')}
        cancelButtonLabel={t('Cancel')}
        emojiPlaceholderLabel={t('Search')}
        disablePublishLabel={t('Authenticating')}
        placeholderButtonLabel={t('Reflect')}
        editorState={editorState}
        onPublish={data => {
          if (!profileDataReq.data) {
            return;
          }
          handlePublish(data);
        }}
        setEditorState={setEditorState}
        onCancelClick={() => singleSpa.navigateToUrl(location.pathname)}
        avatar={profileDataReq?.data?.avatar}
        profileId={loggedProfileData?.did?.id}
        disablePublish={disablePublishing}
        getLinkPreview={getLinkPreview}
        getMentions={handleMentionQueryChange}
        getTags={handleTagQueryChange}
        tags={tagSearch?.data}
        mentions={mentionSearch?.data}
        background={{ light: 'grey9', dark: 'grey3' }}
      />
      {/*@TODO reflect error logic goes here */}
    </>
  );
};

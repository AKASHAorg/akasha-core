import React, { useMemo, useState } from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { getLinkPreview, serializeSlateToBase64, useAnalytics } from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  useGetMyProfileQuery,
  useInfiniteGetReflectReflectionsQuery,
  useInfiniteGetReflectionsFromBeamQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData } from '@akashaorg/typings/lib/ui';
import { useQueryClient } from '@tanstack/react-query';

export type ReflectEditorProps = {
  beamId: string;
  reflectToId: string;
  showEditorInitialValue: boolean;
};

const ReflectEditor: React.FC<ReflectEditorProps> = props => {
  const { beamId, reflectToId, showEditorInitialValue } = props;
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const [editorState, setEditorState] = useState(null);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);

  const isReflectOfReflection = reflectToId !== beamId;

  const queryClient = useQueryClient();
  const mentionSearch = null;
  const tagSearch = null;

  const publishReflection = useCreateReflectMutation({
    onSuccess: async data => {
      if (!isReflectOfReflection) {
        await queryClient.invalidateQueries(
          useInfiniteGetReflectionsFromBeamQuery.getKey({
            id: data.createAkashaReflect.document.beam?.id,
          }),
        );
      }

      if (isReflectOfReflection) {
        await queryClient.invalidateQueries(
          useInfiniteGetReflectReflectionsQuery.getKey({
            id: reflectToId,
          }),
        );
      }

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

  const handlePublish = (data: IPublishData) => {
    const reflection = isReflectOfReflection ? { reflection: reflectToId } : {};
    publishReflection.mutate({
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
          ...reflection,
        },
      },
    });
  };

  // @TODO: fix author name
  const entryAuthorName = undefined;

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
        actionLabel={t('Reflect')}
        placeholderButtonLabel={t('Reflect')}
        cancelButtonLabel={t('Cancel')}
        emojiPlaceholderLabel={t('Search')}
        disableActionLabel={t('Authenticating')}
        editorState={editorState}
        showEditorInitialValue={showEditorInitialValue}
        avatar={profileDataReq?.data?.avatar}
        profileId={loggedProfileData?.did?.id}
        disablePublish={disablePublishing}
        tags={tagSearch?.data}
        mentions={mentionSearch?.data}
        background={{ light: 'grey9', dark: 'grey3' }}
        onPublish={data => {
          if (!profileDataReq.data) {
            return;
          }
          handlePublish(data);
        }}
        setEditorState={setEditorState}
        onCancelClick={() => {
          //@TODO
        }}
        getLinkPreview={getLinkPreview}
        getMentions={setMentionQuery}
        getTags={setTagQuery}
      />
      {/*@TODO reflect error logic goes here */}
    </>
  );
};

export default ReflectEditor;

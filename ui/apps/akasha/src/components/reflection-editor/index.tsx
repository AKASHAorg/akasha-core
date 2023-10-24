import React, { useMemo, useState } from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ReflectCard from '@akashaorg/ui-lib-feed/lib/components/cards/reflect-card';
import {
  decodeb64SlateContent,
  getLinkPreview,
  serializeSlateToBase64,
  useAnalytics,
  useEntryNavigation,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  useGetMyProfileQuery,
  useInfiniteGetReflectionsFromBeamQuery,
  useUpdateAkashaReflectMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, EntityTypes, IPublishData } from '@akashaorg/typings/lib/ui';
import { useQueryClient } from '@tanstack/react-query';
import { AkashaReflect } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type ReflectionEditorProps = {
  beamId: string;
  showEditorInitialValue?: boolean;
} & (
  | {
      action: 'edit';
      reflectionId: string;
      content: AkashaReflect['content'];
    }
  | { action: 'reflect'; reflectionId?: null; content?: AkashaReflect['content'] }
);

export const ReflectionEditor: React.FC<ReflectionEditorProps> = props => {
  const { action, beamId, reflectionId, showEditorInitialValue, content } = props;
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();
  const [analyticsActions] = useAnalytics();
  const [editInProgress, setEditInProgress] = useState(false);
  const [newContent, setNewContent] = useState(null);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [editorState, setEditorState] = useState(
    content ? content.flatMap(item => decodeb64SlateContent(item.value)) : null,
  );
  const onNavigate = useEntryNavigation(getRoutingPlugin().navigateTo);

  const queryClient = useQueryClient();
  const mentionSearch = null;
  const tagSearch = null;

  const publishReflection = useCreateReflectMutation({
    onSuccess: async data => {
      await queryClient.invalidateQueries(
        useInfiniteGetReflectionsFromBeamQuery.getKey({
          id: data.createAkashaReflect.document.beam?.id,
        }),
      );
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
    onSettled: () => {
      onNavigate(
        { id: reflectionId || beamId, authorId: loggedProfileData.did?.id },
        reflectionId ? EntityTypes.BEAM : EntityTypes.REFLECT,
      );
    },
  });

  const editReflection = useUpdateAkashaReflectMutation({
    onMutate: () => {
      setEditInProgress(true);
    },
    onSuccess: async data => {
      await queryClient.invalidateQueries(
        useInfiniteGetReflectionsFromBeamQuery.getKey({
          id: data.updateAkashaReflect.document.beam?.id,
        }),
      );
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Updated',
      });
    },
    onSettled: () => {
      setEditInProgress(false);
      setNewContent(null);
      onNavigate(
        { id: reflectionId || beamId, authorId: loggedProfileData.did?.id },
        reflectionId ? EntityTypes.BEAM : EntityTypes.REFLECT,
      );
    },
  });

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });

  const loggedProfileData = profileDataReq.data;
  const disablePublishing = useMemo(() => !loggedProfileData?.did?.id, [loggedProfileData]);

  const handleEdit = (data: IPublishData) => {
    const content = [
      {
        label: data.metadata.app,
        propertyType: 'slate-block',
        value: serializeSlateToBase64(data.slateContent),
      },
    ];
    setNewContent(content);
    editReflection.mutate({
      i: {
        id: reflectionId,
        content: {
          content,
        },
      },
    });
  };

  const handlePublish = (data: IPublishData) => {
    const reflection = reflectionId ? { reflection: reflectionId } : {};
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

  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };

  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
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
      {editInProgress && newContent ? (
        <ReflectCard
          entryData={
            {
              id: reflectionId,
              active: true,
              content: newContent,
              author: {
                id: loggedProfileData.did.id,
                isViewer: loggedProfileData.did.isViewer,
              },
            } as AkashaReflect
          }
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
        />
      ) : (
        <Editor
          actionLabel={action === 'edit' ? t('Save') : t('Reflect')}
          cancelButtonLabel={t('Cancel')}
          emojiPlaceholderLabel={t('Search')}
          disablePublishLabel={t('Authenticating')}
          placeholderButtonLabel={t('Reflect')}
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

            if (action === 'reflect') handlePublish(data);

            if (action === 'edit') handleEdit(data);
          }}
          setEditorState={setEditorState}
          onCancelClick={() => {
            //@TODO
          }}
          getLinkPreview={getLinkPreview}
          getMentions={handleMentionQueryChange}
          getTags={handleTagQueryChange}
        />
      )}
      {/*@TODO reflect error logic goes here */}
    </>
  );
};

import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ReflectionCard, { ReflectCardProps } from '../cards/reflection-card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  decodeb64SlateContent,
  getLinkPreview,
  serializeSlateToBase64,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetMyProfileQuery,
  useGetReflectionByIdQuery,
  useInfiniteGetReflectReflectionsQuery,
  useInfiniteGetReflectionsFromBeamQuery,
  useUpdateAkashaReflectMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData } from '@akashaorg/typings/lib/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';

const MAX_EDIT_TIME_IN_MINUTES = 10;

const EditableReflection: React.FC<ReflectCardProps & { reflectToId: string }> = props => {
  const { entryData, reflectToId, ...rest } = props;
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const [editInProgress, setEditInProgress] = useState(false);
  const [newContent, setNewContent] = useState(null);
  const [edit, setEdit] = useState(false);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [editorState, setEditorState] = useState(null);

  const beamId = entryData.beamID;
  const isReflectOfReflection = beamId !== reflectToId;
  const queryClient = useQueryClient();
  const mentionSearch = null;
  const tagSearch = null;

  useEffect(() => {
    setEditorState(entryData.content.flatMap(item => decodeb64SlateContent(item.value)));
  }, [entryData.content]);

  const editReflection = useUpdateAkashaReflectMutation({
    onMutate: () => {
      setEditInProgress(true);
    },
    onSuccess: async data => {
      if (!isReflectOfReflection) {
        await queryClient.invalidateQueries(
          useInfiniteGetReflectionsFromBeamQuery.getKey({
            id: beamId,
          }),
        );
      }

      if (isReflectOfReflection) {
        if (data.updateAkashaReflect.document.id === reflectToId) {
          await queryClient.invalidateQueries(
            useGetReflectionByIdQuery.getKey({
              id: reflectToId,
            }),
          );
        }
        if (data.updateAkashaReflect.document.id !== reflectToId) {
          await queryClient.invalidateQueries(
            useInfiniteGetReflectReflectionsQuery.getKey({
              id: reflectToId,
            }),
          );
        }
      }
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Updated',
      });
    },
    onSettled: () => {
      setEdit(false);
      setEditInProgress(false);
      setNewContent(null);
    },
  });

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });

  const wrapperRef = useCloseActions(() => {
    setEdit(false);
  });

  const reflectionCreationElapsedTimeInMinutes = dayjs(new Date()).diff(
    entryData.createdAt,
    'minutes',
  );
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
        id: entryData.id,
        content: {
          content,
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

  if (editInProgress && newContent) {
    return (
      <Stack customStyle={`px-4 border border(grey8 dark:grey3) bg-secondaryLight/30`}>
        <ReflectionCard
          entryData={{
            ...entryData,
            content: newContent,
          }}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
        />
      </Stack>
    );
  }

  return (
    <>
      {edit ? (
        <div ref={wrapperRef}>
          <Editor
            actionLabel={t('Save')}
            cancelButtonLabel={t('Cancel')}
            emojiPlaceholderLabel={t('Search')}
            disableActionLabel={t('Authenticating')}
            placeholderButtonLabel={t('Reflect')}
            editorState={editorState}
            showEditorInitialValue={true}
            showCancelButton={true}
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

              handleEdit(data);
            }}
            setEditorState={setEditorState}
            onCancelClick={() => {
              setEdit(false);
            }}
            getLinkPreview={getLinkPreview}
            getMentions={setMentionQuery}
            getTags={setTagQuery}
            customStyle="px-2 pt-2"
          />
          {/*@TODO reflect error logic goes here */}
        </div>
      ) : (
        <ReflectionCard
          entryData={entryData}
          editable={reflectionCreationElapsedTimeInMinutes <= MAX_EDIT_TIME_IN_MINUTES}
          onEdit={() => setEdit(true)}
          notEditableLabel={t('A reflection created over 10 minutes ago cannot be edited.')}
          {...rest}
        />
      )}
    </>
  );
};

export default EditableReflection;

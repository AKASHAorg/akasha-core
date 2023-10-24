import React, { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ReflectCard, { ReflectCardProps } from '../cards/reflect-card';
import {
  decodeb64SlateContent,
  getLinkPreview,
  serializeSlateToBase64,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetMyProfileQuery,
  useInfiniteGetReflectionsFromBeamQuery,
  useUpdateAkashaReflectMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData } from '@akashaorg/typings/lib/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

const EditableReflection: React.FC<ReflectCardProps> = props => {
  const { entryData, ...rest } = props;
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const [editInProgress, setEditInProgress] = useState(false);
  const [newContent, setNewContent] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [editorState, setEditorState] = useState(
    entryData.content.flatMap(item => decodeb64SlateContent(item.value)),
  );

  const queryClient = useQueryClient();
  const mentionSearch = null;
  const tagSearch = null;

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
      setCanEdit(false);
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
    setCanEdit(false);
  });

  const lastEditInMinutes = dayjs(new Date()).diff(entryData.createdAt, 'minutes');
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
        <ReflectCard
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
      {canEdit ? (
        <div ref={wrapperRef}>
          <Editor
            actionLabel={t('Save')}
            cancelButtonLabel={t('Cancel')}
            emojiPlaceholderLabel={t('Search')}
            disableActionLabel={t('Authenticating')}
            placeholderButtonLabel={t('Reflect')}
            editorState={editorState}
            showEditorInitialValue={true}
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
              //@TODO
            }}
            getLinkPreview={getLinkPreview}
            getMentions={setMentionQuery}
            getTags={setTagQuery}
          />
          {/*@TODO reflect error logic goes here */}
        </div>
      ) : (
        <ReflectCard
          entryData={entryData}
          editable={lastEditInMinutes <= 10000}
          onEdit={() => setCanEdit(true)}
          {...rest}
        />
      )}
    </>
  );
};

export default EditableReflection;

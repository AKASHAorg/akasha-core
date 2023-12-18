import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import ReflectionCard, { ReflectCardProps } from '../cards/reflection-card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import {
  decodeb64SlateContent,
  getLinkPreview,
  transformSource,
  serializeSlateToBase64,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import {
  useGetMyProfileQuery,
  useUpdateAkashaReflectMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  GetReflectionsFromBeamDocument,
  GetReflectionsByAuthorDidDocument,
  GetReflectReflectionsDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData } from '@akashaorg/typings/lib/ui';
import { useApolloClient } from '@apollo/client';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { createPortal } from 'react-dom';
import { XCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

const MAX_EDIT_TIME_IN_MINUTES = 10;

const EditableReflection: React.FC<ReflectCardProps & { reflectToId: string }> = props => {
  const { entryData, reflectToId, ...rest } = props;
  const { t } = useTranslation('ui-lib-feed');
  const [analyticsActions] = useAnalytics();
  const [editInProgress, setEditInProgress] = useState(false);
  const [newContent, setNewContent] = useState(null);
  const [edit, setEdit] = useState(false);
  //@TODO
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  const beamId = entryData.beamID;
  const isReflectOfReflection = beamId !== reflectToId;
  const apolloClient = useApolloClient();
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
      setEdit(false);
      if (!isReflectOfReflection) {
        await apolloClient.refetchQueries({ include: [GetReflectionsFromBeamDocument] });
      }

      if (isReflectOfReflection) {
        if (data.updateAkashaReflect.document.id === reflectToId) {
          await apolloClient.refetchQueries({ include: [GetReflectionsByAuthorDidDocument] });
        }
        if (data.updateAkashaReflect.document.id !== reflectToId) {
          await apolloClient.refetchQueries({ include: [GetReflectReflectionsDocument] });
        }
      }
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Updated',
      });
    },
    onError: () => {
      setShowErrorSnackbar(true);
    },
    onSettled: () => {
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

  useEffect(() => {
    if (showErrorSnackbar) {
      setTimeout(() => setShowErrorSnackbar(false), 5000);
    }
  }, [showErrorSnackbar]);

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
            customStyle="px-2 pt-2"
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
            transformSource={transformSource}
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
      {showErrorSnackbar &&
        createPortal(
          <Snackbar
            title={t('Something went wrong.')}
            description={t('Please try again.')}
            handleDismiss={() => setShowErrorSnackbar(false)}
            type="alert"
            icon={<XCircleIcon />}
          />,
          document.getElementById('edit-reflect-error-snackbar-container'),
        )}
    </>
  );
};

export default EditableReflection;

import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import ReflectionCard, { ReflectCardProps } from '../cards/reflection-card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import getSDK from '@akashaorg/awf-sdk';
import {
  decodeb64SlateContent,
  getLinkPreview,
  transformSource,
  serializeSlateToBase64,
  useAnalytics,
  useGetLoginProfile,
} from '@akashaorg/ui-awf-hooks';
import {
  GetReflectionsFromBeamDocument,
  GetReflectReflectionsDocument,
  useUpdateAkashaReflectMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useApolloClient } from '@apollo/client';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { createPortal } from 'react-dom';
import { XCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

const MAX_EDIT_TIME_IN_MINUTES = 10;

const EditableReflection: React.FC<ReflectCardProps & { reflectToId: string }> = props => {
  const { entryData, reflectToId, ...rest } = props;
  const { t } = useTranslation('ui-lib-feed');
  const [analyticsActions] = useAnalytics();
  const [newContent, setNewContent] = useState(null);
  const [edit, setEdit] = useState(false);
  //@TODO
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [editorState, setEditorState] = useState(null);
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

  const sdk = getSDK();
  const beamId = entryData.beamID;
  const isReflectOfReflection = beamId !== reflectToId;
  const apolloClient = useApolloClient();
  //@TODO
  const mentionSearch = null;
  const tagSearch = null;

  useEffect(() => {
    setEditorState(entryData.content.flatMap(item => decodeb64SlateContent(item.value)));
  }, [entryData.content]);

  const [editReflection, { loading: editInProgress }] = useUpdateAkashaReflectMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async () => {
      setEdit(false);
      setNewContent(null);

      if (!isReflectOfReflection) {
        await apolloClient.refetchQueries({ include: [GetReflectionsFromBeamDocument] });
      }

      if (isReflectOfReflection) {
        await apolloClient.refetchQueries({ include: [GetReflectReflectionsDocument] });
      }
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Updated',
      });
    },
    onError: () => {
      setShowErrorSnackbar(true);
    },
  });

  const wrapperRef = useCloseActions(() => {
    setEdit(false);
  });
  const loggedInProfileReq = useGetLoginProfile();
  const disablePublishing = useMemo(
    () => !loggedInProfileReq?.akashaProfile?.did?.id,
    [loggedInProfileReq],
  );

  const loggedInProfileData = loggedInProfileReq?.akashaProfile;
  const reflectionCreationElapsedTimeInMinutes = dayjs(new Date()).diff(
    entryData.createdAt,
    'minutes',
  );

  const handleEdit = (data: IPublishData) => {
    const content = [
      {
        label: data.metadata.app,
        propertyType: 'slate-block',
        value: serializeSlateToBase64(data.slateContent),
      },
    ];
    setNewContent(content);
    editReflection({
      variables: {
        i: {
          id: entryData.id,
          content: {
            content,
          },
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

  if (editInProgress && newContent) {
    return (
      <Stack
        background={{ light: 'secondaryLight/30', dark: 'secondaryDark/30' }}
        customStyle="border border(grey8 dark:grey3)"
      >
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
            avatar={loggedInProfileData?.avatar}
            profileId={loggedInProfileData?.did?.id}
            disablePublish={disablePublishing}
            tags={tagSearch?.data}
            mentions={mentionSearch?.data}
            background={{ light: 'grey9', dark: 'grey3' }}
            customStyle="px-2 pt-2"
            onPublish={data => {
              if (!loggedInProfileData) {
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
            type={NotificationTypes.Alert}
            icon={<XCircleIcon />}
          />,
          document.getElementById('edit-reflect-error-snackbar-container'),
        )}
    </>
  );
};

export default EditableReflection;

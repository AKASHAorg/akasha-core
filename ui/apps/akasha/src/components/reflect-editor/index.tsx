import React, { MutableRefObject, useEffect, useMemo, useState } from 'react';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import getSDK from '@akashaorg/awf-sdk';
import {
  transformSource,
  serializeSlateToBase64,
  useAnalytics,
  useShowFeedback,
  decodeb64SlateContent,
  useGetLoginProfile,
} from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  GetReflectionsFromBeamDocument,
  GetReflectReflectionsDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsCategories,
  IPublishData,
  NotificationTypes,
  ReflectEntryData,
} from '@akashaorg/typings/lib/ui';
import { useApolloClient } from '@apollo/client';
import { createPortal } from 'react-dom';
import { XCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { PendingReflect } from './pending-reflect';

export type ReflectEditorProps = {
  beamId: string;
  reflectToId: string;
  showEditorInitialValue: boolean;
  pendingReflectRef: MutableRefObject<HTMLDivElement>;
};

const ReflectEditor: React.FC<ReflectEditorProps> = props => {
  const { beamId, reflectToId, showEditorInitialValue, pendingReflectRef } = props;
  const { t } = useTranslation('app-akasha-integration');
  const [analyticsActions] = useAnalytics();
  const [editorState, setEditorState] = useState(null);
  const [newContent, setNewContent] = useState<ReflectEntryData>(null);
  //@TODO
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [showErrorSnackbar, setShowErrorSnackbar] = useShowFeedback(false);
  const [showEditor, setShowEditor] = useState(showEditorInitialValue);

  const sdk = getSDK();
  const isReflectOfReflection = reflectToId !== beamId;
  const apolloClient = useApolloClient();
  //@TODO
  const mentionSearch = null;
  const tagSearch = null;

  const [publishReflection, { loading: publishing }] = useCreateReflectMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async () => {
      if (!isReflectOfReflection) {
        await apolloClient.refetchQueries({ include: [GetReflectionsFromBeamDocument] });
      }

      if (isReflectOfReflection) {
        await apolloClient.refetchQueries({ include: [GetReflectReflectionsDocument] });
      }

      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
    onError: () => {
      setShowEditor(true);
      setEditorState(newContent.content.flatMap(item => decodeb64SlateContent(item.value)));
      setShowErrorSnackbar(true);
    },
  });
  const loggedInProfileReq = useGetLoginProfile();
  const disablePublishing = useMemo(
    () => !loggedInProfileReq?.akashaProfile?.did?.id,
    [loggedInProfileReq],
  );

  const loggedInProfileData = loggedInProfileReq?.akashaProfile;

  const handlePublish = (data: IPublishData) => {
    const reflection = isReflectOfReflection ? { reflection: reflectToId } : {};
    const content = {
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
    };

    setNewContent({ ...content, id: null, authorId: null });

    publishReflection({
      variables: {
        i: {
          content,
        },
      },
    });
  };

  // @TODO: fix author name
  const entryAuthorName = undefined;

  useEffect(() => {
    setShowEditor(showEditorInitialValue);
  }, [showEditorInitialValue]);

  return (
    <>
      <Editor
        actionLabel={t('Reflect')}
        placeholderButtonLabel={t('Reflect')}
        cancelButtonLabel={t('Cancel')}
        emojiPlaceholderLabel={t('Search')}
        disableActionLabel={t('Authenticating')}
        editorState={editorState}
        showEditorInitialValue={showEditor}
        avatar={loggedInProfileData?.avatar}
        profileId={loggedInProfileData?.did?.id}
        disablePublish={disablePublishing}
        tags={tagSearch?.data}
        mentions={mentionSearch?.data}
        background={{ light: 'grey9', dark: 'grey3' }}
        onPublish={data => {
          if (!loggedInProfileData) {
            return;
          }
          handlePublish(data);
        }}
        setEditorState={setEditorState}
        onCancelClick={() => {
          //@TODO
        }}
        getMentions={setMentionQuery}
        getTags={setTagQuery}
        transformSource={transformSource}
      />
      {publishing &&
        newContent &&
        pendingReflectRef.current &&
        createPortal(
          <PendingReflect
            entryData={{ ...newContent, id: null, authorId: loggedInProfileData?.did?.id }}
          />,
          pendingReflectRef.current,
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
          document.getElementById('reflect-error-snackbar-container'),
        )}
    </>
  );
};

export default ReflectEditor;

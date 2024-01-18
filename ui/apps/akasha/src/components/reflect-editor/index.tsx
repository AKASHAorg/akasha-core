import React, { MutableRefObject, useEffect, useMemo, useState } from 'react';
import ReflectionEditor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import getSDK from '@akashaorg/awf-sdk';
import {
  transformSource,
  serializeSlateToBase64,
  useAnalytics,
  decodeb64SlateContent,
  useGetLoginProfile,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  useIndexReflectionMutation,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsCategories,
  IPublishData,
  NotificationTypes,
  NotificationEvents,
  ReflectEntryData,
} from '@akashaorg/typings/lib/ui';
import { createPortal } from 'react-dom';
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
  const { uiEvents } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);
  const [editorState, setEditorState] = useState(null);
  const [newContent, setNewContent] = useState<ReflectEntryData>(null);
  //@TODO
  const [, setMentionQuery] = useState(null);
  const [, setTagQuery] = useState(null);

  const [showEditor, setShowEditor] = useState(showEditorInitialValue);

  const sdk = getSDK();
  const isReflectOfReflection = reflectToId !== beamId;
  //@TODO
  const mentionSearch = null;
  const tagSearch = null;

  const [publishReflection, publishReflectionMutation] = useCreateReflectMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async () => {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
  });
  const [indexReflection, indexReflectionMutation] = useIndexReflectionMutation();

  const authenticatedProfileDataReq = useGetLoginProfile();
  const disablePublishing = useMemo(
    () => !authenticatedProfileDataReq?.akashaProfile?.did?.id,
    [authenticatedProfileDataReq],
  );

  const authenticatedProfile = authenticatedProfileDataReq?.akashaProfile;

  const showAlertNotification = React.useCallback((message: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Alert,
        message,
      },
    });
  }, []);

  React.useEffect(() => {
    if (indexReflectionMutation.error || publishReflectionMutation.error) {
      setShowEditor(true);
      setEditorState(newContent.content.flatMap(item => decodeb64SlateContent(item.value)));
      showAlertNotification(`${t(`Something went wrong when publishing the reflection`)}.`);
    }
  }, [
    indexReflectionMutation,
    newContent?.content,
    publishReflectionMutation,
    showAlertNotification,
    t,
  ]);

  const handlePublish = async (data: IPublishData) => {
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

    const response = await publishReflection({
      variables: {
        i: {
          content,
        },
      },
    });
    if (response.data?.createAkashaReflect) {
      const indexingVars = await getSDK().api.auth.prepareIndexedID(
        response.data.createAkashaReflect.document.id,
      );
      await indexReflection({
        variables: indexingVars,
      });
    } else {
      showAlertNotification(`${t(`Something went wrong when publishing the reflection`)}.`);
    }
  };

  useEffect(() => {
    setShowEditor(showEditorInitialValue);
  }, [showEditorInitialValue]);

  return (
    <>
      <ReflectionEditor
        actionLabel={t('Reflect')}
        placeholderButtonLabel={t('Reflect')}
        placeholderLabel={t('My thoughts on this are...')}
        cancelButtonLabel={t('Cancel')}
        emojiPlaceholderLabel={t('Search')}
        disableActionLabel={t('Authenticating')}
        editorState={editorState}
        showEditorInitialValue={showEditor}
        avatar={authenticatedProfile?.avatar}
        profileId={authenticatedProfile?.did?.id}
        disablePublish={disablePublishing}
        tags={tagSearch?.data}
        mentions={mentionSearch?.data}
        background={{ light: 'grey9', dark: 'grey3' }}
        onPublish={data => {
          if (!authenticatedProfile) {
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
      {(publishReflectionMutation.loading || indexReflectionMutation.loading) &&
        newContent &&
        pendingReflectRef.current &&
        createPortal(
          <PendingReflect
            entryData={{ ...newContent, id: null, authorId: authenticatedProfile?.did?.id }}
          />,
          pendingReflectRef.current,
        )}
    </>
  );
};

export default ReflectEditor;

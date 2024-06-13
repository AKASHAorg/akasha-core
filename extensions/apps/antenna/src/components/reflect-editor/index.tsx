import React, { useRef, useState } from 'react';
import ReflectionEditor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import getSDK from '@akashaorg/awf-sdk';
import {
  transformSource,
  encodeSlateToBase64,
  useAnalytics,
  decodeb64SlateContent,
  useRootComponentProps,
  useMentions,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  useIndexReflectionMutation,
  GetReflectionStreamDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsCategories,
  IPublishData,
  NotificationTypes,
  NotificationEvents,
  ReflectEntryData,
} from '@akashaorg/typings/lib/ui';
import { usePendingReflections } from '@akashaorg/ui-awf-hooks/lib/use-pending-reflections';
import { useApolloClient } from '@apollo/client';
import { getEditorValueForTest } from './get-editor-value-for-test';

export type ReflectEditorProps = {
  beamId: string;
  reflectToId: string;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
};

const ReflectEditor: React.FC<ReflectEditorProps> = props => {
  const { beamId, reflectToId, showEditor, setShowEditor } = props;
  const { t } = useTranslation('app-antenna');
  const [analyticsActions] = useAnalytics();
  const { uiEvents } = useRootComponentProps();
  const uiEventsRef = React.useRef(uiEvents);
  const [editorState, setEditorState] = useState(null);
  const [newContent, setNewContent] = useState<ReflectEntryData>(null);
  const pendingReflectionIdRef = useRef(null);
  const apolloClient = useApolloClient();

  const sdk = getSDK();
  const isReflectOfReflection = reflectToId !== beamId;

  const [publishReflection, publishReflectionMutation] = useCreateReflectMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: () => {
      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
  });
  const [indexReflection, indexReflectionMutation] = useIndexReflectionMutation();
  const { addPendingReflection, removePendingReflection, pendingReflections } =
    usePendingReflections();

  const {
    data: { authenticatedDID, authenticatedProfile },
  } = useAkashaStore();

  const { setMentionQuery, mentions } = useMentions(authenticatedDID);
  const handleGetMentions = (query: string) => {
    setMentionQuery(query);
  };

  const showAlertNotification = React.useCallback((message: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Alert,
        message,
      },
    });
  }, []);

  /*
   * Currently jsdom doesn't support contenteditable and as a result slate editor as well.
   * This effect is a workaround to set the value of the editor during tests
   **/
  React.useEffect(() => {
    const editorValueForTest = getEditorValueForTest();
    if (editorValueForTest) {
      setEditorState([
        {
          type: 'paragraph',
          children: [
            {
              text: editorValueForTest,
            },
          ],
        },
      ]);
    }
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
    setShowEditor,
  ]);

  const handlePublish = async (data: IPublishData) => {
    const reflection = isReflectOfReflection ? { reflection: reflectToId, isReply: true } : {};
    const content = {
      active: true,
      beamID: beamId,
      content: [
        {
          label: data.metadata.app,
          propertyType: 'slate-block',
          value: encodeSlateToBase64(data.slateContent),
        },
      ],
      createdAt: new Date().toISOString(),
      ...reflection,
    };
    setNewContent({ ...content, authorId: null, id: null });
    pendingReflectionIdRef.current = `pending-reflection-${pendingReflections.length}`;
    addPendingReflection({
      ...content,
      id: pendingReflectionIdRef.current,
      authorId: authenticatedDID,
    });

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
      apolloClient.refetchQueries({ include: [GetReflectionStreamDocument] }).then(() => {
        removePendingReflection(pendingReflectionIdRef.current);
      });
    } else {
      showAlertNotification(`${t(`Something went wrong when publishing the reflection`)}.`);
    }
  };

  return (
    <ReflectionEditor
      actionLabel={t('Reflect')}
      placeholderButtonLabel={t('Reflect')}
      placeholderLabel={t('My thoughts on this are...')}
      cancelButtonLabel={t('Cancel')}
      emojiPlaceholderLabel={t('Search')}
      disableActionLabel={t('Authenticating')}
      maxEncodedLengthErrLabel={t('Text block exceeds line limit, please review!')}
      editorState={editorState}
      showEditor={showEditor}
      setShowEditor={setShowEditor}
      avatar={authenticatedProfile?.avatar}
      profileId={authenticatedDID}
      disablePublish={!authenticatedDID}
      mentions={mentions}
      getMentions={handleGetMentions}
      background={{ light: 'white', dark: 'grey2' }}
      onPublish={data => {
        if (!authenticatedDID) {
          return;
        }
        handlePublish(data);
      }}
      setEditorState={setEditorState}
      onCancelClick={() => {
        //@TODO
      }}
      transformSource={transformSource}
      encodingFunction={encodeSlateToBase64}
    />
  );
};

export default ReflectEditor;

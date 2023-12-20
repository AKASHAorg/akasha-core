import React, { useEffect, useMemo, useState } from 'react';
import EntryCardLoading from '@akashaorg/design-system-components/lib/components/Entry/EntryCardLoading';
import Editor from '@akashaorg/design-system-components/lib/components/ReflectionEditor';
import Snackbar from '@akashaorg/design-system-core/lib/components/Snackbar';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  transformSource,
  serializeSlateToBase64,
  useAnalytics,
  useShowFeedback,
} from '@akashaorg/ui-awf-hooks';
import {
  useCreateReflectMutation,
  useGetMyProfileQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated';
import {
  GetReflectionsFromBeamDocument,
  GetReflectReflectionsDocument,
  GetReflectionsByAuthorDidDocument,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import { AnalyticsCategories, IPublishData } from '@akashaorg/typings/lib/ui';
import { useApolloClient } from '@apollo/client';
import { createPortal } from 'react-dom';
import { XCircleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

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
  //@TODO
  const [mentionQuery, setMentionQuery] = useState(null);
  const [tagQuery, setTagQuery] = useState(null);
  const [showErrorSnackbar, setShowErrorSnackbar] = useShowFeedback(false);
  const [showEditor, setShowEditor] = useState(showEditorInitialValue);

  const isReflectOfReflection = reflectToId !== beamId;

  const apolloClient = useApolloClient();
  const mentionSearch = null;
  const tagSearch = null;

  const publishReflection = useCreateReflectMutation({
    onSuccess: async data => {
      if (!isReflectOfReflection) {
        await apolloClient.refetchQueries({ include: [GetReflectionsFromBeamDocument] });
      }

      if (isReflectOfReflection) {
        if (data.createAkashaReflect.document.id === reflectToId) {
          await apolloClient.refetchQueries({ include: [GetReflectionsByAuthorDidDocument] });
        }
        if (data.createAkashaReflect.document.id !== reflectToId) {
          await apolloClient.refetchQueries({ include: [GetReflectReflectionsDocument] });
        }
      }

      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Published',
      });
    },
    onError: () => {
      setShowEditor(true);
      setShowErrorSnackbar(true);
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

  useEffect(() => {
    setShowEditor(showEditorInitialValue);
  }, [showEditorInitialValue]);

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
        showEditorInitialValue={showEditor}
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
        getMentions={setMentionQuery}
        getTags={setTagQuery}
        transformSource={transformSource}
      />
      {showErrorSnackbar &&
        createPortal(
          <Snackbar
            title={t('Something went wrong.')}
            description={t('Please try again.')}
            handleDismiss={() => setShowErrorSnackbar(false)}
            type="alert"
            icon={<XCircleIcon />}
          />,
          document.getElementById('reflect-error-snackbar-container'),
        )}
    </>
  );
};

export default ReflectEditor;

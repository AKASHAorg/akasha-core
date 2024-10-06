import React, { useState } from 'react';
import dayjs from 'dayjs';
import ReflectionCard, { ReflectionCardProps } from '../cards/reflection-card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import getSDK from '@akashaorg/core-sdk';
import {
  decodeb64SlateContent,
  encodeSlateToBase64,
  useAnalytics,
  useRootComponentProps,
  useMentions,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import { useUpdateAkashaReflectMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useTranslation } from 'react-i18next';
import {
  AnalyticsCategories,
  IPublishData,
  NotificationTypes,
  NotificationEvents,
} from '@akashaorg/typings/lib/ui';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import ErrorBoundary, {
  ErrorBoundaryProps,
} from '@akashaorg/design-system-core/lib/components/ErrorBoundary';
import ReflectionEditorRenderer from './reflection-editor-renderer';

const MAX_EDIT_TIME_IN_MINUTES = 10;

const EditableReflection: React.FC<ReflectionCardProps> = props => {
  const { reflectionData, ...rest } = props;
  const { t } = useTranslation('ui-lib-feed');
  const { uiEvents, logger } = useRootComponentProps();
  const _uiEvents = React.useRef(uiEvents);
  const [analyticsActions] = useAnalytics();

  const [newContent, setNewContent] = useState(null);
  const [edit, setEdit] = useState(false);

  const sdk = getSDK();

  const {
    data: { authenticatedDID, authenticatedProfile },
  } = useAkashaStore();
  const { setMentionQuery, mentions } = useMentions(authenticatedDID);
  const handleGetMentions = (query: string) => {
    setMentionQuery(query);
  };

  const [editReflection, { loading: editInProgress }] = useUpdateAkashaReflectMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
    onCompleted: async () => {
      setEdit(false);
      setNewContent(null);

      analyticsActions.trackEvent({
        category: AnalyticsCategories.REFLECT,
        action: 'Reflect Updated',
      });
    },
    onError: () => {
      const notifMsg = t(`Something went wrong.`);
      _uiEvents.current.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Info,
          title: notifMsg,
        },
      });
    },
  });

  const wrapperRef = useCloseActions(() => {
    setEdit(false);
  });

  const reflectionCreationElapsedTimeInMinutes = dayjs(new Date()).diff(
    reflectionData.createdAt,
    'minutes',
  );

  const handleEdit = (data: IPublishData) => {
    const content = [
      {
        label: data.metadata.app,
        propertyType: 'slate-block',
        value: encodeSlateToBase64(data.slateContent),
      },
    ];
    setNewContent(content);
    editReflection({
      variables: {
        i: {
          id: reflectionData.id,
          content: {
            // reflection's content is now immutable
            //content,
          },
        },
      },
    });
  };

  const errorBoundaryProps: Pick<ErrorBoundaryProps, 'errorObj' | 'logger'> = {
    errorObj: {
      type: 'script-error',
      title: t('Error in reflection rendering'),
    },
    logger,
  };

  if (editInProgress && newContent) {
    return (
      <Stack
        background={{ light: 'secondaryLight/10', dark: 'secondaryDark/10' }}
        customStyle="border border(grey8 dark:grey3)"
      >
        <ReflectionCard
          reflectionData={{
            ...reflectionData,
            content: newContent,
          }}
          contentClickable={false}
          pending={true}
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
          <ReflectionEditorRenderer
            actionLabel={t('Save')}
            cancelButtonLabel={t('Cancel')}
            emojiPlaceholderLabel={t('Search')}
            disableActionLabel={t('Authenticating')}
            placeholderButtonLabel={t('Reflect')}
            maxEncodedLengthErrLabel={t('Text block exceeds line limit, please review!')}
            avatar={authenticatedProfile?.avatar}
            profileId={authenticatedProfile?.did?.id}
            disablePublish={!authenticatedDID}
            initialEditorValue={reflectionData?.content?.flatMap(item =>
              decodeb64SlateContent(item?.value),
            )}
            mentions={mentions}
            getMentions={handleGetMentions}
            onPublish={data => {
              if (!authenticatedDID) {
                return;
              }

              handleEdit(data);
            }}
            onCancelClick={() => {
              setEdit(false);
            }}
          />
        </div>
      ) : (
        <>
          <ErrorBoundary {...errorBoundaryProps}>
            <ReflectionCard
              reflectionData={reflectionData}
              editable={reflectionCreationElapsedTimeInMinutes <= MAX_EDIT_TIME_IN_MINUTES}
              onEdit={() => setEdit(true)}
              notEditableLabel={t('A reflection created over 10 minutes ago cannot be edited.')}
              {...rest}
            />
          </ErrorBoundary>
        </>
      )}
    </>
  );
};

export default EditableReflection;

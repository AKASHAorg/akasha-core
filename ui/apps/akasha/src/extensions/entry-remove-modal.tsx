import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import {
  RootExtensionProps,
  AnalyticsCategories,
  EntityTypes,
  EntityTypesMap,
} from '@akashaorg/typings/ui';
import {
  useDeletePost,
  useDeleteComment,
  withProviders,
  useAnalytics,
  ThemeWrapper,
} from '@akashaorg/ui-awf-hooks';

const { ConfirmationModal, ModalContainer } = DS;

const EntryRemoveModal: React.FC<RootExtensionProps> = props => {
  const { extensionData, logger } = props;
  const { t } = useTranslation('app-akasha-integration');

  const postDeleteQuery = useDeletePost(extensionData.itemId);
  const commentDeleteQuery = useDeleteComment(extensionData.itemId);
  const [analyticsActions] = useAnalytics();

  const handleModalClose = React.useCallback(() => {
    props.singleSpa.navigateToUrl(location.pathname);
  }, [props.singleSpa]);

  // extensionData.itemType comes as a string from navigateToModal this can lead to bugs
  const handleDelete = React.useCallback(() => {
    if (!!extensionData && extensionData.itemType !== undefined) {
      if (extensionData.itemType === EntityTypes.REPLY) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Reply Deleted',
        });
        commentDeleteQuery.mutate(extensionData.itemId);
      } else if (extensionData.itemType === EntityTypes.POST) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Post Deleted',
        });
        postDeleteQuery.mutate(extensionData.itemId);
      } else {
        logger.error(`unsupported itemType ${EntityTypesMap[extensionData.itemType]}!`);
      }
    } else {
      logger.error('property itemType is undefined!');
    }
    handleModalClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionData, commentDeleteQuery, postDeleteQuery, handleModalClose, logger]);

  const entryLabelText = React.useMemo(() => {
    if (extensionData.itemType === EntityTypes.POST) {
      return t('post');
    }
    return t('reply');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionData.itemType]);

  return (
    <ConfirmationModal
      onClose={handleModalClose}
      onConfirm={handleDelete}
      onCancel={handleModalClose}
      modalTitle={`${t('Delete')} ${entryLabelText}`}
      closeLabel={t('Close')}
      textDetails={
        <>
          <div>
            {t('Are you sure you want to delete your')} {entryLabelText}?
          </div>
          <div>{t('This cannot be undone')}.</div>
        </>
      }
      cancelLabel={t('Cancel')}
      confirmLabel={t('Delete')}
      error={(postDeleteQuery.error || commentDeleteQuery.error) as Error | null}
    />
  );
};

const ModalWrapper: React.FC<RootExtensionProps> = props => {
  return (
    <I18nextProvider i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}>
      <EntryRemoveModal {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ModalContainer>
          <ErrorLoader
            type="script-error"
            title="Error in entry remove modal"
            details={err.message}
          />
        </ModalContainer>
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;

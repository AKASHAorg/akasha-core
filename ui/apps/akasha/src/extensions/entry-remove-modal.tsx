import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootExtensionProps, AnalyticsCategories, EntityTypes } from '@akashaorg/typings/ui';
import DS from '@akashaorg/design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  useDeletePost,
  useDeleteComment,
  withProviders,
  useAnalytics,
  ThemeWrapper,
} from '@akashaorg/ui-awf-hooks';

const { ConfirmationModal, ModalContainer, ErrorLoader } = DS;

const EntryRemoveModal: React.FC<RootExtensionProps> = props => {
  const { extensionData, logger } = props;
  const { t } = useTranslation('app-akasha-integration');

  const postDeleteQuery = useDeletePost(extensionData.entryId);
  const commentDeleteQuery = useDeleteComment(extensionData.entryId);
  const [analyticsActions] = useAnalytics();

  const handleModalClose = React.useCallback(() => {
    props.singleSpa.navigateToUrl(location.pathname);
  }, [props.singleSpa]);

  const handleDeletePost = React.useCallback(() => {
    if (extensionData && typeof +extensionData.entryType === 'number') {
      if (+extensionData.entryType === EntityTypes.COMMENT) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Reply Deleted',
        });
        commentDeleteQuery.mutate(extensionData.entryId);
      } else if (+extensionData.entryType === EntityTypes.ENTRY) {
        analyticsActions.trackEvent({
          category: AnalyticsCategories.POST,
          action: 'Post Deleted',
        });
        postDeleteQuery.mutate(extensionData.entryId);
      } else {
        logger.error('entryType is undefined!');
      }
    } else {
      logger.error('property entryType is undefined!');
    }
    handleModalClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionData, commentDeleteQuery, postDeleteQuery, handleModalClose, logger]);

  const entryLabelText = React.useMemo(() => {
    if (extensionData.entryType === EntityTypes.ENTRY) {
      return t('post');
    }
    return t('reply');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionData.entryType]);

  return (
    <ConfirmationModal
      onClose={handleModalClose}
      onConfirm={handleDeletePost}
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
    <I18nextProvider i18n={props.plugins?.translation?.i18n}>
      <EntryRemoveModal {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  renderType: 'createRoot',
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

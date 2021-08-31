import singleSpaReact from 'single-spa-react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { useErrors, withProviders } from '@akashaproject/ui-awf-hooks';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useDeletePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { useDeleteComment } from '@akashaproject/ui-awf-hooks/lib/use-comments.new';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import i18next, { setupI18next } from '../i18n';

const { ConfirmationModal, ThemeSelector, lightTheme, darkTheme, ModalContainer, ErrorLoader } = DS;

const EntryRemoveModal: React.FC<RootComponentProps> = props => {
  const { activeModal, logger } = props;
  const [errorState] = useErrors({
    logger: props.logger,
  });
  const { t } = useTranslation('app-akasha-integration');

  const postDeleteQuery = useDeletePost(activeModal.entryId);
  const commentDeleteQuery = useDeleteComment(activeModal.entryId);

  const handleModalClose = React.useCallback(() => {
    props.singleSpa.navigateToUrl(location.pathname);
  }, [props.singleSpa]);

  const handleDeletePost = React.useCallback(() => {
    if (activeModal && activeModal.entryType) {
      const entryType = parseInt(activeModal.entryType, 10);
      if (entryType === ItemTypes.COMMENT) {
        commentDeleteQuery.mutate(activeModal.entryId);
      } else if (entryType === ItemTypes.ENTRY) {
        postDeleteQuery.mutate(activeModal.entryId);
      } else {
        logger.error('entryType is undefined!');
      }
    } else {
      logger.error('property entryType is undefined!');
    }
    handleModalClose();
  }, [activeModal, commentDeleteQuery, postDeleteQuery, handleModalClose, logger]);

  const entryLabelText = React.useMemo(() => {
    if (activeModal.entryType === ItemTypes.ENTRY) {
      return t('post');
    }
    return t('reply');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeModal.entryType]);

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
      errors={errorState}
    />
  );
};

const ModalWrapper: React.FC<RootComponentProps> = props => {
  return (
    <I18nextProvider i18n={i18next}>
      <EntryRemoveModal {...props} />
    </I18nextProvider>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(ModalWrapper),
  errorBoundary: (err, errorInfo, props) => {
    if (props.logger) {
      props.logger.error('Error: %s; Info: %s', err, errorInfo);
    }
    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <ModalContainer>
          <ErrorLoader type="script-error" title="Error in editor modal" details={err.message} />
        </ModalContainer>
      </ThemeSelector>
    );
  },
});

export const bootstrap = (props: RootComponentProps) => {
  return setupI18next({
    logger: props.logger,
    // must be the same as the one in ../../i18next.parser.config.js
    namespace: 'app-akasha-integration',
  });
};

export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;

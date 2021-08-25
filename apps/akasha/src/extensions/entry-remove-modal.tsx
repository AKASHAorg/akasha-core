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

const { ConfirmationModal } = DS;

const EntryRemoveModal: React.FC<RootComponentProps> = props => {
  const { activeModal } = props;
  const [errorState] = useErrors({
    logger: props.logger,
  });
  const { t } = useTranslation('app-akasha-integration');

  const postDeleteQuery = useDeletePost(activeModal.entryId);
  const commentDeleteQuery = useDeleteComment(activeModal.entryId);

  const handleDeletePost = () => {
    if (activeModal.entryType === ItemTypes.COMMENT) {
      return commentDeleteQuery.mutate(activeModal.entryId);
    }
    postDeleteQuery.mutate(activeModal.entryId);
    handleModalClose();
  };

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };
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
    return <div>!</div>;
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

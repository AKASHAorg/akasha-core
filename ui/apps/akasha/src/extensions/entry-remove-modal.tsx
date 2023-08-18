import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import { I18nextProvider, useTranslation } from 'react-i18next';

import {
  RootExtensionProps,
  AnalyticsCategories,
  EntityTypes,
  EntityTypesMap,
} from '@akashaorg/typings/ui';

import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { withProviders } from '@akashaorg/ui-awf-hooks';

const EntryRemoveModal: React.FC<RootExtensionProps> = props => {
  const { extensionData, logger, singleSpa } = props;

  const [showModal, setShowModal] = useState(true);

  const { t } = useTranslation('app-akasha-integration');

  const postDeleteQuery = undefined;
  const commentDeleteQuery = undefined;
  const [analyticsActions] = [undefined];

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    singleSpa.navigateToUrl(location.pathname);
  }, [singleSpa]);

  // extensionData.itemType comes as a string from navigateToModal this can lead to bugs
  const handleDelete = useCallback(() => {
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

  const entryLabelText = useMemo(() => {
    if (extensionData.itemType === EntityTypes.POST) {
      return t('post');
    }
    return t('reply');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionData.itemType]);

  return (
    <Modal
      show={showModal}
      title={{ label: `${t('Delete')} ${entryLabelText}`, variant: 'h5' }}
      actions={[
        { label: 'Cancel', variant: 'secondary', onClick: handleModalClose },
        { label: 'Delete', variant: 'primary', onClick: handleDelete },
      ]}
      onClose={handleModalClose}
    >
      <Stack>
        <Text align="center">{`${t(
          'Are you sure you want to delete your',
        )} "${entryLabelText}"?`}</Text>

        <Text align="center" variant="subtitle1">
          {t('This cannot be undone')}
        </Text>
      </Stack>
    </Modal>
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
      <ErrorLoader type="script-error" title="Error in entry remove modal" details={err.message} />
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;
export const mount = reactLifecycles.mount;
export const unmount = reactLifecycles.unmount;

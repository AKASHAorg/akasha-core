import singleSpaReact from 'single-spa-react';
import ReactDOMClient from 'react-dom/client';
import React from 'react';
import { useRootComponentProps, withProviders, useModalData } from '@akashaorg/ui-awf-hooks';
import { IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Modal from '@akashaorg/design-system-core/lib/components/Modal';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useUpdateBeamMutation } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import getSDK from '@akashaorg/awf-sdk';

const RemoveModal = (_: IRootExtensionProps) => {
  const { t } = useTranslation();
  const sdk = getSDK();

  const [updateBeam, updateBeamQuery] = useUpdateBeamMutation({
    context: { source: sdk.services.gql.contextSources.composeDB },
  });

  const { modalData } = useModalData();

  const handleModalClose = React.useCallback(() => {
    window.history.replaceState(null, null, location.pathname);
  }, []);

  React.useEffect(() => {
    if (updateBeamQuery.data?.updateAkashaBeam?.document) {
      handleModalClose();
    }
  }, [handleModalClose, updateBeamQuery]);

  const handleRemove = () => {
    updateBeam({
      variables: {
        i: {
          content: {
            active: false,
          },
          id: modalData['beamId'],
        },
      },
    }).catch(err => console.error(err));
  };

  return (
    <Modal
      show={modalData?.name === 'remove-beam-confirmation'}
      title={{
        label: t('Are you sure you want to remove this beam?'),
        variant: 'h6',
      }}
      actions={[
        { label: t('Cancel'), variant: 'secondary', onClick: handleModalClose },
        { label: t('Remove'), variant: 'primary', onClick: handleRemove },
      ]}
      onClose={handleModalClose}
      customStyle="py-4 px-6 md:px-24"
    >
      {updateBeamQuery.error && <Text variant="body2">{updateBeamQuery.error.message}</Text>}
      {updateBeamQuery.called && updateBeamQuery.loading && (
        <Text variant="body2">{t('Removing beam. Please wait')}</Text>
      )}
      {!updateBeamQuery.error &&
        updateBeamQuery.called &&
        !updateBeamQuery.loading &&
        !updateBeamQuery.data?.updateAkashaBeam && <Text>{t('Beam successfully removed.')}</Text>}
    </Modal>
  );
};

const RemoveConfirmationModal = (props: IRootExtensionProps) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <RemoveModal {...props} />
    </I18nextProvider>
  );
};

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: withProviders(RemoveConfirmationModal),
  errorBoundary: (err, errorInfo, props: IRootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(errorInfo)}, ${errorInfo}`);
    }

    return <ErrorLoader type="script-error" title="Error in editor" details={err.message} />;
  },
});

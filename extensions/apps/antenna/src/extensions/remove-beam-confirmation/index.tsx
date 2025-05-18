import React from 'react';
import { useRootComponentProps, withProviders, useModalData } from '@akashaorg/ui-core-hooks';
import { IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useUpdateBeamMutation } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import getSDK from '@akashaorg/core-sdk';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
const Component: React.FC<IRootExtensionProps> = () => {
  const sdk = getSDK();
  const { t } = useTranslation();
  const { modalData } = useModalData();
  const [updateBeam, updateBeamQuery] = useUpdateBeamMutation({
    context: {
      source: sdk.services.gql.contextSources.composeDB,
    },
  });
  const handleModalClose = React.useCallback(() => {
    window.history.replaceState(null, null, location.pathname);
  }, []);
  const handleRemove = () => {
    updateBeam({
      variables: {
        i: {
          content: {
            active: false,
          },
          id: modalData['beamId'],
          options: {
            shouldIndex: false,
          },
        },
      },
    })
      .then(() => handleModalClose())
      .catch(err => console.error(err));
  };
  const isQueryCalled = updateBeamQuery.called && updateBeamQuery.loading;
  return (
    <AlertDialog
      open={modalData?.name === 'remove-beam-confirmation'}
      onOpenChange={handleModalClose}
    >
      <AlertDialogContent className="py-4 px-6 md:px-24 sm:rounded-3xl border-none bg-card">
        <AlertDialogHeader className="sm:text-center">
          {!isQueryCalled && (
            <AlertDialogTitle>{t('Are you sure you want to remove this beam?')}</AlertDialogTitle>
          )}
          <AlertDialogDescription>
            {updateBeamQuery.error && (
              <Typography variant="sm">{updateBeamQuery.error.message}</Typography>
            )}
            {isQueryCalled && (
              <Typography variant="sm">{t('Removing beam. Please wait')}</Typography>
            )}
            {!updateBeamQuery.error &&
              updateBeamQuery.called &&
              !updateBeamQuery.loading &&
              !updateBeamQuery.data?.updateAkashaBeam && (
                <Typography>{t('Beam successfully removed.')}</Typography>
              )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button variant="outline" disabled={isQueryCalled} onClick={handleModalClose}>
            {t('Cancel')}
          </Button>
          <Button disabled={isQueryCalled} onClick={handleRemove}>
            {t('Remove')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
const RemoveBeamModal = (props: IRootExtensionProps) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <Component {...props} />
    </I18nextProvider>
  );
};
export default withProviders(RemoveBeamModal);

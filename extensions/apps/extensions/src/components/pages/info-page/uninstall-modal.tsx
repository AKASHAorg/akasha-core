import React, { useCallback, useEffect, useState } from 'react';
import getSDK from '@akashaorg/core-sdk';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';

import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Loader2 } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { useTranslation } from 'react-i18next';
import { useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
enum UninstallModalStates {
  CONFIRMATION = 'confirmation',
  LOADING = 'loading',
  ERROR = 'error',
  RELOAD_PAGE = 'reload-page',
}
type UninstallModalProps = {
  appName: string;
  appDisplayName: string;
  show: boolean;
  onModalClose: () => void;
};
export const UninstallModal: React.FC<UninstallModalProps> = props => {
  const { t } = useTranslation('app-extensions');
  const { logger } = useRootComponentProps();
  const { appName, appDisplayName, show, onModalClose } = props;
  const [modalState, setModalState] = useState<UninstallModalStates>(
    UninstallModalStates.CONFIRMATION,
  );
  const onUninstall = useCallback(async () => {
    const sdk = getSDK();
    try {
      setModalState(UninstallModalStates.LOADING);
      await sdk.services.appSettings.uninstall(appName);
      //uninstall executes instantly and the timeout is to allow smooth transition from confirmation to loading state
      setTimeout(() => {
        setModalState(UninstallModalStates.RELOAD_PAGE);
      }, 500);
      //allow some time to read the reload page info text
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      //uninstall executes instantly and the timeout is to allow smooth transition from confirmation to error state
      setTimeout(() => {
        setModalState(UninstallModalStates.ERROR);
      }, 500);
      logger.error(`uninstall failed: ${JSON.stringify(err)}`);
    }
  }, [appName, logger]);

  const modalProps = React.useMemo(() => {
    switch (modalState) {
      case UninstallModalStates.CONFIRMATION:
        return {
          title: {
            label: t('Uninstall extension'),
            variant: 'h5',
          },
          actions: {
            primary: {
              variant: 'secondary',
              label: t('Cancel'),
              onClick: onModalClose,
            },
            secondary: {
              variant: 'primary',
              label: t('Uninstall'),
              onClick: onUninstall,
            },
          },
        };
      case UninstallModalStates.ERROR:
        return {
          title: {
            label: t('Uninstall failed'),
            variant: 'h5',
          },
          actions: {
            secondary: {
              variant: 'secondary',
              label: t('OK'),
              onClick: onModalClose,
            },
          },
        };
      case UninstallModalStates.RELOAD_PAGE:
        return {
          title: {
            label: t('Page reload'),
            variant: 'h5',
          },
        };
      case UninstallModalStates.LOADING:
      default:
        return {};
    }
  }, [onModalClose, onUninstall, t, modalState]);
  useEffect(() => {
    //ensure every time a modal is shown it starts from confirmation state
    if (show) {
      setModalState(UninstallModalStates.CONFIRMATION);
    }
  }, [show]);
  return (
    <AlertDialog
      open={show}
      onOpenChange={() => {
        if (modalState !== UninstallModalStates.LOADING) {
          onModalClose();
        }
      }}
    >
      <AlertDialogContent className="w-80 md:w-[38rem] md:px-6 sm:rounded-3xl border-none bg-card">
        <AlertDialogHeader className="sm:text-center">
          <AlertDialogTitle>{modalProps?.title?.label}</AlertDialogTitle>

          <AlertDialogDescription>
            {modalState === UninstallModalStates.CONFIRMATION && (
              <Typography className="text-center">
                {t(
                  'Are you sure you want to uninstall {{appDisplayName}}? This action might affect the appearance of functionality of other apps',
                  {
                    appDisplayName,
                  },
                )}
              </Typography>
            )}
            {
              //@TODO replace with Loader component once its created
            }
            {modalState === UninstallModalStates.LOADING && (
              <Stack spacing={5} alignItems="center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <Typography variant="sm" bold>
                  {t('Uninstalling extension...')}
                </Typography>
              </Stack>
            )}
            {modalState === UninstallModalStates.RELOAD_PAGE && (
              <Typography className="text-center">
                {t('The page will now reload to prevent possible technical issues. ')}
              </Typography>
            )}
            {modalState === UninstallModalStates.ERROR && (
              <Typography className="text-center">
                {t(
                  'An error occurred while trying to uninstall the extension. Please check your network connection and try again.',
                )}
              </Typography>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          {modalProps?.actions?.secondary && (
            <Button variant="outline" onClick={modalProps?.actions?.secondary?.onClick}>
              {modalProps?.actions?.secondary?.label}
            </Button>
          )}
          {modalProps?.actions?.primary && (
            <Button onClick={modalProps?.actions?.primary?.onClick}>
              {modalProps?.actions?.primary?.label}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

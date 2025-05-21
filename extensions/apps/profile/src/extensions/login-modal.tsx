import React from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { IRootExtensionProps } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps, withProviders, useModalData } from '@akashaorg/ui-core-hooks';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
const LoginModal = () => {
  const { t } = useTranslation('app-profile');
  const location = window.location;
  const { getCorePlugins } = useRootComponentProps();
  const { modalData } = useModalData();
  const message = React.useRef('To continue you need an AKASHA World account');
  if (modalData?.message) {
    message.current = modalData.message;
  }
  const messageTitle = React.useRef('AKASHA World');
  if (modalData?.title) {
    messageTitle.current = modalData.title;
  }
  React.useEffect(() => {
    return () => {
      message.current = null;
      messageTitle.current = null;
    };
  }, []);
  const handleModalClose = () => {
    window.history.replaceState(null, null, location.pathname);
  };
  const handleConnectClick = () => {
    getCorePlugins().routing.navigateTo?.(
      {
        appName: '@akashaorg/app-auth-ewa',
        getNavigationUrl: appRoutes => {
          const redirectTo = new URLSearchParams(location.search).get('redirectTo');
          return `${appRoutes.Connect}?${new URLSearchParams({
            redirectTo: redirectTo || location.pathname,
          }).toString()}`;
        },
      },
      true,
    );
  };
  return (
    <AlertDialog open={modalData?.name === 'login'} onOpenChange={handleModalClose}>
      <AlertDialogContent className="py-4 px-6 md:px-24 sm:rounded-3xl border-none bg-card">
        <AlertDialogHeader className="sm:text-center">
          <AlertDialogTitle>
            {t('{{messageTitle}}', {
              messageTitle: messageTitle?.current,
            })}
          </AlertDialogTitle>

          <AlertDialogDescription>
            <Stack alignItems="center" spacing={2} className="w-full">
              <Typography className="text-center">
                {t('{{message}}', {
                  message: message?.current,
                })}
              </Typography>
            </Stack>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button variant="outline" className="rounded-xl" onClick={handleModalClose}>
            {t('Cancel')}
          </Button>
          <Button className="rounded-xl" onClick={handleConnectClick}>
            {t('Connect')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Wrapped = (_: IRootExtensionProps) => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <LoginModal />
    </I18nextProvider>
  );
};
export default withProviders(Wrapped);

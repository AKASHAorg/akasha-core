import * as React from 'react';
import singleSpaReact from 'single-spa-react';
import ReactDOM from 'react-dom';
import { RootExtensionProps } from '@akashaproject/ui-awf-typings';
import DS from '@akashaproject/design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { withProviders, ThemeWrapper } from '@akashaproject/ui-awf-hooks';
import { StorageKeys } from '@akashaproject/ui-awf-typings/lib/profile';

const { Box, Button, ModalContainer, ModalCardLogin, Text, Icon, ErrorLoader } = DS;

const LoginModal = (props: RootExtensionProps) => {
  const { t } = useTranslation('app-profile');
  const location = useLocation();

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  const handleSignInClick = () => {
    props.navigateTo({
      appName: '@akashaproject/app-auth-ewa',
      pathName: appRoutes => appRoutes[appRoutes.SIGN_IN],
      queryStrings: (qsStringify, currentRedirect) => {
        if (!currentRedirect) {
          return qsStringify({ redirectTo: location.pathname });
        }
        return `${qsStringify({
          redirectTo: `${location.pathname}?${qsStringify(currentRedirect)}`,
        })}`;
      },
    });
  };

  const handleSignUpClick = () => {
    sessionStorage.setItem(StorageKeys.LAST_URL, location.pathname);
    props.singleSpa.navigateToUrl('/auth-app/sign-up');
  };

  return (
    <ModalContainer onModalClose={handleModalClose} innerStyle={{ maxWidth: '90%' }}>
      <ModalCardLogin>
        <Icon
          type="close"
          color="gray"
          onClick={handleModalClose}
          style={{ position: 'absolute', right: '0.4rem' }}
          clickable
        />
        <Box direction="column" align="center" justify="center" data-testid="modal-card-login">
          <Box direction="column" align="center" fill="horizontal">
            <Text weight="bold" size="large" margin={{ vertical: '0.5rem' }}>
              {t('Ethereum World')}
            </Text>
            <Text color="gray" size="large" textAlign="center" margin={{ vertical: '0.5rem' }}>
              {t('To continue you need an Ethereum World account')}
            </Text>
          </Box>
          <Box
            direction="row"
            align="center"
            gap="small"
            fill="horizontal"
            pad={{ vertical: 'medium' }}
            style={{ maxWidth: '12rem' }}
          >
            <Button onClick={handleSignInClick} label={t('Sign In')} fill="horizontal" />
            <Button
              primary={true}
              onClick={handleSignUpClick}
              label={t('Sign Up')}
              fill="horizontal"
            />
          </Box>
        </Box>
      </ModalCardLogin>
    </ModalContainer>
  );
};

const Wrapped = (props: RootExtensionProps) => (
  <Router>
    <React.Suspense fallback={<></>}>
      <I18nextProvider i18n={props.plugins?.translation?.i18n}>
        <LoginModal {...props} />
      </I18nextProvider>
    </React.Suspense>
  </Router>
);

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(Wrapped),
  errorBoundary: (err, errorInfo, props: RootExtensionProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(err)}, ${errorInfo}`);
    }
    return (
      <ThemeWrapper {...props}>
        <ErrorLoader type="script-error" title="Error in login modal" details={err.message} />
      </ThemeWrapper>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;

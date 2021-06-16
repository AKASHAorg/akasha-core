import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const { Box, LoginModal, ViewportSizeProvider } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { logger } = props;
  // const { path } = activeWhen;
  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    globalChannel: props.globalChannel,
    authService: props.sdkModules.auth.authService,
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [loggedProfileData, loggedProfileActions] = useProfile({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
    globalChannel: props.globalChannel,
  });

  const [flagged, setFlagged] = React.useState('');
  const [flaggedContentType, setFlaggedContentType] = React.useState('');

  React.useEffect(() => {
    if (loginState.ethAddress && flagged.length) {
      modalStateActions.hide(MODAL_NAMES.LOGIN);
      modalStateActions.show(MODAL_NAMES.REPORT);
    }
  }, [loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      reportModal: false,
    },
    isLoggedIn: !!loginState.ethAddress,
  });

  const { t } = useTranslation();

  const loginErrors: string | null = React.useMemo(() => {
    if (errorState && Object.keys(errorState).length) {
      const txt = Object.keys(errorState)
        .filter(key => key.split('.')[0] === 'useLoginState')
        .map(k => errorState![k])
        .reduce((acc, errObj) => `${acc}\n${errObj.error.message}`, '');
      return txt;
    }
    return null;
  }, [errorState]);

  const showLoginModal = () => {
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };

  const showReportModal = () => {
    modalStateActions.showAfterLogin(MODAL_NAMES.REPORT);
  };

  const hideReportModal = () => {
    modalStateActions.hide(MODAL_NAMES.REPORT);
  };

  const hideLoginModal = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
  };

  return (
    <ViewportSizeProvider>
      <Router>
        <Box>
          <Switch>
            <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
            <Route path={[`${rootRoute}/:pubKey`, menuRoute[MY_PROFILE]]}>
              <ProfilePage
                {...props}
                loggedEthAddress={loginState.ethAddress}
                loginActions={loginActions}
                modalActions={modalStateActions}
                modalState={modalState}
                loggedProfileData={loggedProfileData}
                flagged={flagged}
                flaggedContentType={flaggedContentType}
                reportModalOpen={modalState.report}
                setFlagged={setFlagged}
                setFlaggedContentType={setFlaggedContentType}
                showLoginModal={showLoginModal}
                setReportModalOpen={showReportModal}
                closeReportModal={hideReportModal}
              />
            </Route>
            <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
          </Switch>
        </Box>
        <LoginModal
          showModal={modalState[MODAL_NAMES.LOGIN]}
          slotId={props.layoutConfig.modalSlotId}
          onLogin={loginActions.login}
          onModalClose={hideLoginModal}
          titleLabel={t('Connect a wallet')}
          metamaskModalHeadline={t('Connecting')}
          metamaskModalMessage={t('Please complete the process in your wallet')}
          error={loginErrors}
        />
      </Router>
    </ViewportSizeProvider>
  );
};

export default Routes;

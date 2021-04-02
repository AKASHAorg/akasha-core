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
  const { activeWhen, logger, rxjsOperators } = props;
  const { path } = activeWhen;

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    rxjsOperators,
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
    rxjsOperators: props.rxjsOperators,
  });

  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [flagged, setFlagged] = React.useState('');

  const showLoginModal = () => {
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };

  React.useEffect(() => {
    if (loginState.ethAddress) {
      hideLoginModal();
      if (!!flagged.length) {
        setReportModalOpen(true);
      }
    }
  }, [loginState.ethAddress]);

  React.useEffect(() => {
    if (loginState.pubKey) {
      loggedProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const [modalState, modalStateActions] = useModalState({
    initialState: {},
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

  const hideLoginModal = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
  };

  return (
    <ViewportSizeProvider>
      <Router>
        <Box>
          <Switch>
            <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
            <Route path={[`${path}/:pubKey`, menuRoute[MY_PROFILE]]}>
              <ProfilePage
                {...props}
                loggedEthAddress={loginState.ethAddress}
                loginActions={loginActions}
                modalActions={modalStateActions}
                modalState={modalState}
                loggedProfileData={loggedProfileData}
                flagged={flagged}
                reportModalOpen={reportModalOpen}
                setFlagged={setFlagged}
                showLoginModal={showLoginModal}
                setReportModalOpen={setReportModalOpen}
              />
            </Route>
            <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
          </Switch>
        </Box>
        <LoginModal
          showModal={modalState[MODAL_NAMES.LOGIN]}
          slotId={props.layout.app.modalSlotId}
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

import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const { Box, ViewportSizeProvider } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const { logger } = props;
  // const { path } = activeWhen;
  const [, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    onError: errorActions.createError,
  });

  const [loggedProfileData, loggedProfileActions] = useProfile({
    onError: errorActions.createError,
  });

  const [flagged, setFlagged] = React.useState('');
  const [flaggedContentType, setFlaggedContentType] = React.useState('');

  React.useEffect(() => {
    if (loginState.ethAddress && flagged.length) {
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

  const showLoginModal = () => {
    props.navigateToModal({ name: 'login' });
  };

  const showReportModal = () => {
    modalStateActions.showAfterLogin(MODAL_NAMES.REPORT);
  };

  const hideReportModal = () => {
    modalStateActions.hide(MODAL_NAMES.REPORT);
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
      </Router>
    </ViewportSizeProvider>
  );
};

export default Routes;

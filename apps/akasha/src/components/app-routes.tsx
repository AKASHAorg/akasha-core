import * as React from 'react';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import routes, { FEED, rootRoute, POST, REPLY } from '../routes';
import FeedPage from './feed-page/feed-page';
import { useTranslation } from 'react-i18next';
import { useLoginState, useErrors, useProfile, useModalState } from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';
import PostPage from './post-page/post-page';

const { Box, LoginModal } = DS;
interface AppRoutesProps {
  onError: (err: IAkashaError) => void;
}
const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { sdkModules, globalChannel, logger, layout, onError } = props;

  const { t } = useTranslation();

  const [errorState, errorActions] = useErrors({ logger });

  const [loginState, loginActions] = useLoginState({
    globalChannel: globalChannel,
    onError: errorActions.createError,
    authService: sdkModules.auth.authService,
    ipfsService: sdkModules.commons.ipfsService,
    profileService: sdkModules.profiles.profileService,
  });

  const [loginProfile, loginProfileActions] = useProfile({
    profileService: sdkModules.profiles.profileService,
    ipfsService: sdkModules.commons.ipfsService,
  });

  React.useEffect(() => {
    if (loginState.pubKey) {
      loginProfileActions.getProfileData({ pubKey: loginState.pubKey });
    }
  }, [loginState.pubKey]);

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      reportModal: false,
      editorModal: false,
    },
    isLoggedIn: !!loginState.ethAddress,
  });

  const [flagged, setFlagged] = React.useState('');

  const showLoginModal = () => {
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };

  const hideLoginModal = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
    errorActions.removeLoginErrors();
  };

  const showReportModal = () => {
    modalStateActions.showAfterLogin(MODAL_NAMES.REPORT);
  };

  const hideReportModal = () => {
    modalStateActions.hide(MODAL_NAMES.REPORT);
  };

  const showEditorModal = () => {
    modalStateActions.showAfterLogin(MODAL_NAMES.EDITOR);
  };

  const hideEditorModal = () => {
    modalStateActions.hide(MODAL_NAMES.EDITOR);
  };

  const handleLogin = (providerId: number) => {
    loginActions.login(providerId);
  };

  React.useEffect(() => {
    if (loginState.pubKey) {
      modalStateActions.hide(MODAL_NAMES.LOGIN);
    }
  }, [loginState.pubKey]);

  React.useEffect(() => {
    if (loginState.ethAddress && flagged.length) {
      modalStateActions.hide(MODAL_NAMES.LOGIN);
      modalStateActions.show(MODAL_NAMES.REPORT);
    }
  }, [loginState.ethAddress]);

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

  return (
    <Box>
      <Router>
        <Switch>
          <Route path={routes[FEED]}>
            <FeedPage
              {...props}
              loggedProfileData={loginProfile}
              loginState={loginState}
              flagged={flagged}
              reportModalOpen={modalState.report}
              setFlagged={setFlagged}
              setReportModalOpen={showReportModal}
              closeReportModal={hideReportModal}
              editorModalOpen={modalState.editor}
              setEditorModalOpen={showEditorModal}
              closeEditorModal={hideEditorModal}
              showLoginModal={showLoginModal}
              onError={onError}
            />
          </Route>
          <Route path={`${routes[POST]}/:postId`}>
            <PostPage
              {...props}
              loggedProfileData={loginProfile}
              loginState={loginState}
              flagged={flagged}
              reportModalOpen={modalState.report}
              setFlagged={setFlagged}
              setReportModalOpen={showReportModal}
              closeReportModal={hideReportModal}
              editorModalOpen={modalState.editor}
              setEditorModalOpen={showEditorModal}
              closeEditorModal={hideEditorModal}
              showLoginModal={showLoginModal}
              navigateToUrl={props.singleSpa.navigateToUrl}
              isMobile={props.isMobile}
              onError={onError}
            />
          </Route>
          <Route path={`${routes[REPLY]}/:postId`}>
            <div>Coming Soon!</div>
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[FEED]} />
        </Switch>
      </Router>
      <LoginModal
        showModal={modalState.login}
        slotId={layout.app.modalSlotId}
        onLogin={handleLogin}
        onModalClose={hideLoginModal}
        titleLabel={t('Connect a wallet')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        error={loginErrors}
      />
    </Box>
  );
};

export default AppRoutes;

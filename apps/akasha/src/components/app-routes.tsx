import * as React from 'react';
import { IAkashaError, RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import routes, { FEED, rootRoute, POST } from '../routes';
import FeedPage from './feed-page/feed-page';
import { useTranslation } from 'react-i18next';
import { useLoginState, useErrors } from '@akashaproject/ui-awf-hooks';
import PostPage from './post-page/post-page';

const { Box, LoginModal, ViewportSizeProvider } = DS;
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

  const pubKey = loginState.pubKey;
  const ethAddress = loginState.ethAddress;

  const [loginModalState, setLoginModalState] = React.useState(false);
  const [reportModalOpen, setReportModalOpen] = React.useState(false);
  const [flagged, setFlagged] = React.useState('');

  const showLoginModal = () => {
    setLoginModalState(true);
  };

  const hideLoginModal = () => {
    setLoginModalState(false);
    errorActions.removeLoginErrors();
  };

  const handleLogin = (providerId: number) => {
    loginActions.login(providerId);
  };

  React.useEffect(() => {
    if (pubKey) {
      setLoginModalState(false);
    }
  }, [pubKey]);

  React.useEffect(() => {
    if (ethAddress && flagged.length) {
      setLoginModalState(false);
      setReportModalOpen(true);
    }
  }, [ethAddress]);

  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };

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
    <ViewportSizeProvider>
      <Box>
        <Router>
          <Switch>
            <Route path={routes[FEED]}>
              <FeedPage
                {...props}
                ethAddress={ethAddress}
                pubKey={pubKey}
                flagged={flagged}
                reportModalOpen={reportModalOpen}
                setFlagged={setFlagged}
                setReportModalOpen={setReportModalOpen}
                showLoginModal={showLoginModal}
                onError={onError}
              />
            </Route>
            <Route path={`${routes[POST]}/:postId`}>
              <PostPage
                {...props}
                ethAddress={ethAddress}
                pubKey={pubKey}
                flagged={flagged}
                reportModalOpen={reportModalOpen}
                setFlagged={setFlagged}
                setReportModalOpen={setReportModalOpen}
                showLoginModal={showLoginModal}
                navigateToUrl={props.singleSpa.navigateToUrl}
                isMobile={props.isMobile}
                onError={onError}
              />
            </Route>
            <Redirect exact={true} from={rootRoute} to={routes[FEED]} />
          </Switch>
        </Router>
        <LoginModal
          showModal={loginModalState}
          slotId={layout.app.modalSlotId}
          onLogin={handleLogin}
          onModalClose={hideLoginModal}
          tutorialLinkLabel={t('Tutorial')}
          metamaskModalHeadline={t('Connecting')}
          metamaskModalMessage={t('Please complete the process in your wallet')}
          onTutorialLinkClick={handleTutorialLinkClick}
          helpText={t('What is a wallet? How do i get an Ethereum address?')}
          error={loginErrors}
        />
      </Box>
    </ViewportSizeProvider>
  );
};

export default AppRoutes;

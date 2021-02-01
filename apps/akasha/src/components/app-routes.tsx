import * as React from 'react';
import { RootComponentProps, IAkashaError } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import routes, { NEW_POST, FEED, POSTS, rootRoute } from '../routes';
import FeedPage from './feed-page/feed-page';
import NewPostPage from './new-post-page';
import PostsPage from './posts-page';
import { useTranslation } from 'react-i18next';
import { useLoginState } from '@akashaproject/ui-awf-hooks';

const { Box, LoginModal, ViewportSizeProvider } = DS;
interface AppRoutesProps {
  onError: (err: Error) => void;
}
const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { sdkModules, globalChannel, logger, singleSpa, layout, onError } = props;

  const { t } = useTranslation();

  const [loginState, loginActions] = useLoginState({
    globalChannel: globalChannel,
    onError: (err: IAkashaError) => {
      logger.error('useLoginState error %j', err);
    },
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

  return (
    <ViewportSizeProvider>
      <Box>
        <Router>
          <Switch>
            <Route path={routes[NEW_POST]}>
              <NewPostPage
                sdkModules={sdkModules}
                globalChannel={globalChannel}
                logger={logger}
                showLoginModal={showLoginModal}
                onError={onError}
                ethAddress={ethAddress}
                pubKey={pubKey}
              />
            </Route>
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
            <Route path={routes[POSTS]}>
              <PostsPage
                {...props}
                sdkModules={sdkModules}
                globalChannel={globalChannel}
                logger={logger}
                ethAddress={ethAddress}
                pubKey={pubKey}
                navigateToUrl={singleSpa.navigateToUrl}
                flagged={flagged}
                reportModalOpen={reportModalOpen}
                setFlagged={setFlagged}
                setReportModalOpen={setReportModalOpen}
                showLoginModal={showLoginModal}
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
        />
      </Box>
    </ViewportSizeProvider>
  );
};

export default AppRoutes;

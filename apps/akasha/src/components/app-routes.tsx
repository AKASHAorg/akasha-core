import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import { useGlobalLogin } from '@akashaproject/ui-awf-hooks';
import routes, { NEW_POST, FEED, POSTS, rootRoute } from '../routes';
import FeedPage from './feed-page/feed-page';
import NewPostPage from './new-post-page';
import PostsPage from './posts-page';
import { createContextStore, ActionMapper } from 'easy-peasy';
import { LoggedProfileStateModel } from '../state/logged-profile-state';
import { useTranslation } from 'react-i18next';

const { Box, LoginModal, ViewportSizeProvider } = DS;
interface AppRoutesProps {
  profileStore: ReturnType<typeof createContextStore>;
  onError: (err: Error) => void;
}
const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { sdkModules, globalChannel, logger, singleSpa, layout, profileStore, onError } = props;

  const { t } = useTranslation();

  const pubKey = profileStore.useStoreState((state: LoggedProfileStateModel) => state.data.pubKey);
  const ethAddress = profileStore.useStoreState(
    (state: LoggedProfileStateModel) => state.data.ethAddress,
  );
  const updateData = profileStore.useStoreActions(
    (act: ActionMapper<LoggedProfileStateModel, '1'>) => act.updateData,
  );
  const authorize = profileStore.useStoreActions(
    (act: ActionMapper<LoggedProfileStateModel, '1'>) => act.authorize,
  );
  const [loginModalState, setLoginModalState] = React.useState(false);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [flagged, setFlagged] = React.useState('');

  const showLoginModal = () => {
    setLoginModalState(true);
  };

  const hideLoginModal = () => {
    setLoginModalState(false);
  };

  const handleLogin = (providerId: number) => {
    authorize(providerId);
  };

  React.useEffect(() => {
    if (pubKey) {
      setLoginModalState(false);
    }
  }, [pubKey]);

  React.useEffect(() => {
    if (ethAddress && flagged.length) {
      setLoginModalState(false);
      setModalOpen(true);
    }
  }, [ethAddress]);

  useGlobalLogin(
    globalChannel,
    data => {
      updateData({
        ethAddress: data.ethAddress,
        pubKey: data.pubKey,
      });
    },
    err => {
      logger.error('[app-routes.tsx]: useGlobalState err %j', err.error);
      onError(err.error);
      setLoginModalState(false);
    },
  );

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
              />
            </Route>
            <Route path={routes[FEED]}>
              <FeedPage
                {...props}
                navigateToUrl={singleSpa.navigateToUrl}
                ethAddress={ethAddress}
                pubKey={pubKey}
                flagged={flagged}
                modalOpen={modalOpen}
                setFlagged={setFlagged}
                setModalOpen={setModalOpen}
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
                navigateToUrl={singleSpa.navigateToUrl}
                flagged={flagged}
                modalOpen={modalOpen}
                setFlagged={setFlagged}
                setModalOpen={setModalOpen}
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

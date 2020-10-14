import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import routes, { NEW_POST, FEED, POSTS, rootRoute } from '../routes';
import FeedPage from './feed-page/feed-page';
import LoginModal from './login-modal';
import NewPostPage from './new-post-page';
import PostsPage from './posts-page';
import { createContextStore, ActionMapper } from 'easy-peasy';
import { LoggedProfileStateModel } from '../state/logged-profile-state';

const { Box, useGlobalLogin } = DS;
interface AppRoutesProps {
  profileStore: ReturnType<typeof createContextStore>;
  onError: (err: Error) => void;
}
const AppRoutes: React.FC<RootComponentProps & AppRoutesProps> = props => {
  const { sdkModules, globalChannel, logger, singleSpa, layout, profileStore, onError } = props;
  const jwtToken = profileStore.useStoreState(
    (state: LoggedProfileStateModel) => state.data.jwtToken,
  );
  const ethAddress = profileStore.useStoreState(
    (state: LoggedProfileStateModel) => state.data.ethAddress,
  );
  const updateData = profileStore.useStoreActions(
    (act: ActionMapper<LoggedProfileStateModel, '1'>) => act.updateData,
  );
  const authorize = profileStore.useStoreActions(
    (act: ActionMapper<LoggedProfileStateModel, '1'>) => act.authorize,
  );
  const [loginModalState, setLoginModalState] = React.useState({
    showLoginModal: false,
  });
  const showLoginModal = () => {
    setLoginModalState({
      showLoginModal: true,
    });
  };
  const hideLoginModal = () => {
    setLoginModalState({
      showLoginModal: false,
    });
  };
  const handleLogin = (providerId: number) => {
    authorize(providerId);
  };
  React.useEffect(() => {
    if (jwtToken) {
      setTimeout(() => {
        setLoginModalState({
          showLoginModal: false,
        });
      }, 1000);
    }
  }, [jwtToken]);
  useGlobalLogin(
    globalChannel,
    data => {
      updateData({
        ethAddress: data.ethAddress,
        jwtToken: data.token,
      });
    },
    err => {
      logger.error('[app-routes.tsx]: useGlobalState err %j', err.error);
      onError(err.error);
      setLoginModalState({
        showLoginModal: false,
      });
    },
  );
  return (
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
              showLoginModal={showLoginModal}
              ethAddress={ethAddress}
              jwtToken={jwtToken}
              onError={onError}
            />
          </Route>
          <Route path={routes[POSTS]}>
            <PostsPage
              sdkModules={sdkModules}
              globalChannel={globalChannel}
              logger={logger}
              navigateToUrl={singleSpa.navigateToUrl}
              showLoginModal={showLoginModal}
              onError={onError}
            />
          </Route>
          <Redirect exact={true} from={rootRoute} to={routes[FEED]} />
        </Switch>
      </Router>
      <LoginModal
        showModal={loginModalState.showLoginModal}
        slotId={layout.modalSlotId}
        onLogin={handleLogin}
        onModalClose={hideLoginModal}
        channels={sdkModules}
        globalChannel={globalChannel}
        logger={logger}
      />
    </Box>
  );
};

export default AppRoutes;

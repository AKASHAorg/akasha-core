import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import routes, { NEW_POST, SETTINGS_PAGE, FEED, POSTS } from '../routes';
import FeedPage from './feed-page';
import LoginModal from './login-modal';
import NewPostPage from './new-post-page';
import PostsPage from './posts-page';
import AKASHASettings from './settings-page';
import { getLoggedProfileStore } from '../state/logged-profile-state';

const { Box, useGlobalLogin } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { sdkModules, globalChannel, logger, singleSpa, layout } = props;
  const Login = getLoggedProfileStore();
  const jwtToken = Login.useStoreState((state: any) => state.data.jwtToken);
  const updateData = Login.useStoreActions((act: any) => act.updateData);
  const authorize = Login.useStoreActions((act: any) => act.authorize);
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
      logger.error('[app-routes.tsx]: useGlobalState err %j', err);
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
              onLoginModalShow={showLoginModal}
            />
          </Route>
          <Route path={routes[SETTINGS_PAGE]}>
            <AKASHASettings
              sdkModules={sdkModules}
              globalChannel={globalChannel}
              logger={logger}
              onLoginModalShow={showLoginModal}
            />
          </Route>
          <Route path={routes[FEED]}>
            <FeedPage sdkModules={sdkModules} globalChannel={globalChannel} logger={logger} />
          </Route>
          <Route path={routes[POSTS]}>
            <PostsPage
              sdkModules={sdkModules}
              globalChannel={globalChannel}
              logger={logger}
              navigateToUrl={singleSpa.navigateToUrl}
              onLoginModalShow={showLoginModal}
            />
          </Route>
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

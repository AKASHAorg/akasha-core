import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useGlobalLogin } from '@akashaproject/ui-awf-hooks';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { default as subRoutes, ENS_EDIT_PAGE, SETTINGS_PAGE, rootRoute } from '../../routes';
import EnsEditPage from './ens-edit-page';
import EnsSettingsPage from './ens-settings-page';
import { ActionMapper, StateMapper, createContextStore } from 'easy-peasy';
import { ProfileStateModel } from '../../state/profile-state';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';

const { LoginModal } = DS;

const Routes: React.FC<
  RootComponentProps & { profileStore: ReturnType<typeof createContextStore> }
> = props => {
  const { sdkModules, globalChannel, logger, layout, profileStore } = props;
  const { t } = useTranslation();
  const [loginModalState, setLoginModalState] = React.useState({
    showLoginModal: false,
  });
  const pubKey = profileStore.useStoreState((s: StateMapper<ProfileStateModel, ''>) => s.pubKey);
  const authorize = profileStore.useStoreActions(
    (act: ActionMapper<ProfileStateModel, ''>) => act.authorize,
  );
  const onLoginSuccess = profileStore.useStoreActions(
    (act: ActionMapper<ProfileStateModel, '1'>) => act.handleLoginSuccess,
  );

  const onLoginError = profileStore.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.handleLoginError,
  );
  useGlobalLogin(globalChannel, onLoginSuccess, onLoginError);
  React.useEffect(() => {
    if (pubKey) {
      setTimeout(() => {
        setLoginModalState({
          showLoginModal: false,
        });
      }, 500);
    }
  }, [pubKey]);
  const handleLoginModalShow = () => {
    setLoginModalState({
      showLoginModal: true,
    });
  };
  const handleModalClose = () => {
    setLoginModalState({
      showLoginModal: false,
    });
  };
  const handleLogin = (providerId: number) => {
    authorize(providerId);
  };

  const handleTutorialLinkClick = () => {
    /**
     * @TODO: we should do something here
     */
  };

  return (
    <>
      <Router>
        <Switch>
          <Route path={subRoutes[ENS_EDIT_PAGE]}>
            <EnsEditPage
              sdkModules={sdkModules}
              globalChannel={globalChannel}
              logger={logger}
              onLoginModalShow={handleLoginModalShow}
              profileStore={profileStore}
            />
          </Route>
          <Route path={subRoutes[SETTINGS_PAGE]}>
            <EnsSettingsPage
              sdkModules={sdkModules}
              globalChannel={globalChannel}
              logger={logger}
            />
          </Route>
          {/* Make the edit page default landing page for this app
                          404 routes gets redirected to this page also */}
          <Redirect from={rootRoute} to={subRoutes[ENS_EDIT_PAGE]} exact={true} />
        </Switch>
      </Router>
      <LoginModal
        slotId={layout.app.modalSlotId}
        onLogin={handleLogin}
        onModalClose={handleModalClose}
        showModal={loginModalState.showLoginModal}
        tutorialLinkLabel={t('See Video Tutorial')}
        onTutorialLinkClick={handleTutorialLinkClick}
        metamaskModalHeadline={`${t('Just a few more steps! We are almost there')}...`}
        metamaskModalMessage={t('Approve the message in your Web3 wallet to continue')}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
      />
    </>
  );
};

export default Routes;

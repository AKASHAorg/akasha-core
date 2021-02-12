import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { rootRoute } from '../../routes';
import SearchPage from './search-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors } from '@akashaproject/ui-awf-hooks';

const { Box, LoginModal } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const [errorState, errorActions] = useErrors({ logger: props.logger });

  const [loginState, loginActions] = useLoginState({
    globalChannel: props.globalChannel,
    authService: props.sdkModules.auth.authService,
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      updateProfile: false,
      changeUsername: false,
      changeENS: false,
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
    modalStateActions.show('loginModal');
  };

  const hideLoginModal = () => {
    modalStateActions.hide('loginModal');
  };
  const handleTutorialLinkClick = () => {
    /* goto tutorials */
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/:searchKeyword`}>
            <SearchPage
              logger={props.logger}
              sdkModules={props.sdkModules}
              singleSpa={props.singleSpa}
              globalChannel={props.globalChannel}
              loggedEthAddress={loginState.ethAddress}
              showLoginModal={showLoginModal}
            />
          </Route>
        </Switch>
      </Box>
      <LoginModal
        showModal={modalState.loginModal}
        slotId={props.layout.app.modalSlotId}
        onLogin={loginActions.login}
        onModalClose={hideLoginModal}
        tutorialLinkLabel={t('Tutorial')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        onTutorialLinkClick={handleTutorialLinkClick}
        helpText={t('What is a wallet? How do i get an Ethereum address?')}
        error={loginErrors}
      />
    </Router>
  );
};

export default Routes;

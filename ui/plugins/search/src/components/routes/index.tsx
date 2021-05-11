import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { rootRoute } from '../../routes';
import SearchPage from './search-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState, useErrors, useProfile } from '@akashaproject/ui-awf-hooks';
import { MODAL_NAMES } from '@akashaproject/ui-awf-hooks/lib/use-modal-state';

const { Box, LoginModal } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const [errorState, errorActions] = useErrors({ logger: props.logger });

  const [loginState, loginActions] = useLoginState({
    rxjsOperators: props.rxjsOperators,
    globalChannel: props.globalChannel,
    authService: props.sdkModules.auth.authService,
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
  });

  const [loginProfile] = useProfile({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    globalChannel: props.globalChannel,
  });

  const [modalState, modalStateActions] = useModalState({
    initialState: {
      editor: false,
      report: false,
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
    modalStateActions.show(MODAL_NAMES.LOGIN);
  };

  const hideLoginModal = () => {
    modalStateActions.hide(MODAL_NAMES.LOGIN);
  };

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/:searchKeyword`}>
            <SearchPage
              {...props}
              logger={props.logger}
              sdkModules={props.sdkModules}
              singleSpa={props.singleSpa}
              globalChannel={props.globalChannel}
              rxjsOperators={props.rxjsOperators}
              modalState={modalState}
              modalStateActions={modalStateActions}
              showLoginModal={showLoginModal}
              loginState={loginState}
              loggedProfileData={loginProfile}
            />
          </Route>
        </Switch>
      </Box>
      <LoginModal
        showModal={modalState[MODAL_NAMES.LOGIN]}
        slotId={props.layout.modalSlotId}
        onLogin={loginActions.login}
        onModalClose={hideLoginModal}
        titleLabel={t('Connect a wallet')}
        metamaskModalHeadline={t('Connecting')}
        metamaskModalMessage={t('Please complete the process in your wallet')}
        error={loginErrors}
      />
    </Router>
  );
};

export default Routes;

import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import menuRoute, { MY_PROFILE, rootRoute } from '../../routes';
import ProfilePage from './profile-page';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useLoginState, useModalState } from '@akashaproject/ui-awf-hooks';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';

const { Box } = DS;

const Routes: React.FC<RootComponentProps> = props => {
  const [loginState] = useLoginState({});
  const profileQuery = useGetProfile(loginState.pubKey);

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

  return (
    <Router>
      <Box>
        <Switch>
          <Route path={`${rootRoute}/list`} render={() => <>A list of profiles</>} />
          <Route path={[`${rootRoute}/:pubKey`, menuRoute[MY_PROFILE]]}>
            <ProfilePage
              {...props}
              loggedUser={{ ethAddress: loginState.ethAddress, pubKey: loginState.pubKey }}
              modalActions={modalStateActions}
              modalState={modalState}
              loggedProfileData={profileQuery.data}
              showLoginModal={showLoginModal}
            />
          </Route>
          <Route render={() => <div>{t('Oops, Profile not found!')}</div>} />
        </Switch>
      </Box>
    </Router>
  );
};

export default Routes;

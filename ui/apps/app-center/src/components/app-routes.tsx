import * as React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import DS from '@akashaproject/design-system';
// import { useGetLogin, useGetProfile } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';

import { useTranslation } from 'react-i18next';

import ExplorePage from './pages/explore-page';
import InfoPage from './pages/info-page';
import MyAppsPage from './pages/my-apps-page';
import AppsPage from './pages/apps-page';
import WidgetsPage from './pages/widgets-page';

import NavButton from './nav-button';

import routes, { rootRoute, EXPLORE, MY_APPS, APPS, WIDGETS, INFO } from '../routes';

const { Box, Text, BasicCardBox, Icon } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation();

  return (
    <Router>
      <BasicCardBox style={{ minHeight: '80vh' }}>
        <Box>
          <Box pad="medium">
            <Text>{t('Integration Center')}</Text>
          </Box>
          <Box direction="row" justify="between">
            <NavButton
              path={routes[EXPLORE]}
              label={t('Explore')}
              icon={<Icon type="wallet" />}
              onClick={() => {
                props.navigateTo(routes[EXPLORE]);
              }}
            />
            <NavButton
              path={routes[MY_APPS]}
              label={t('My Apps')}
              icon={<Icon type="wallet" />}
              onClick={() => {
                props.navigateTo(routes[MY_APPS]);
              }}
            />
            <NavButton
              path={routes[APPS]}
              label={t('Apps')}
              icon={<Icon type="wallet" />}
              onClick={() => {
                props.navigateTo(routes[APPS]);
              }}
            />
            <NavButton
              path={routes[WIDGETS]}
              label={t('Widgets')}
              icon={<Icon type="wallet" />}
              onClick={() => {
                props.navigateTo(routes[WIDGETS]);
              }}
            />
          </Box>
        </Box>
        <Box>
          <Switch>
            <Route path={routes[EXPLORE]}>
              <ExplorePage {...props} />
            </Route>
            <Route path={routes[MY_APPS]}>
              <MyAppsPage {...props} />
            </Route>
            <Route path={routes[APPS]}>
              <AppsPage {...props} />
            </Route>
            <Route path={routes[WIDGETS]}>
              <WidgetsPage {...props} />
            </Route>
            <Route path={`${routes[INFO]}/:integrationId`}>
              <InfoPage {...props} />
            </Route>

            <Redirect exact={true} from={rootRoute} to={routes[EXPLORE]} />
          </Switch>
        </Box>
      </BasicCardBox>
    </Router>
  );
};

export default AppRoutes;

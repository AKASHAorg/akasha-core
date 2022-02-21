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
import { I18N_NAMESPACE } from '../services/constants';

const { Box, Text, BasicCardBox } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { t } = useTranslation(I18N_NAMESPACE);

  return (
    <Router>
      <Switch>
        <Route path={`${routes[INFO]}/:integrationId`}>
          <InfoPage {...props} />
        </Route>
        <Route path="*">
          <Redirect exact={true} from={rootRoute} to={routes[EXPLORE]} />
          <BasicCardBox style={{ minHeight: '80vh' }}>
            <Box>
              <Box pad="medium">
                <Text size="large" weight={'bold'}>
                  {t('Integration Center')}
                </Text>
              </Box>
              <Box direction="row" justify="between">
                <NavButton
                  path={routes[EXPLORE]}
                  label={t('Explore')}
                  icon={'explore'}
                  onClick={() => {
                    props.navigateTo(routes[EXPLORE]);
                  }}
                />
                <NavButton
                  path={routes[MY_APPS]}
                  label={t('My Apps')}
                  icon={'integrationAppSmallFill'}
                  onClick={() => {
                    props.navigateTo(routes[MY_APPS]);
                  }}
                />
                <NavButton
                  path={routes[APPS]}
                  label={t('Apps')}
                  icon={'integrationAppSmall'}
                  onClick={() => {
                    props.navigateTo(routes[APPS]);
                  }}
                />
                <NavButton
                  path={routes[WIDGETS]}
                  label={t('Widgets')}
                  icon={'integrationWidgetSmall'}
                  onClick={() => {
                    props.navigateTo(routes[WIDGETS]);
                  }}
                />
              </Box>
            </Box>

            <Box overflow={'auto'} height={{ max: '80vh' }}>
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
              </Switch>
            </Box>
          </BasicCardBox>
        </Route>
      </Switch>
    </Router>
  );
};

export default AppRoutes;

import * as React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import MyBoxProfile from './my-box-profile';
import BoxSettings from './box-settings';
import BoxProfile from './3box-profile';
import { default as subRoutes, rootRoute, EDIT_PAGE, SETTINGS_PAGE } from '../routes';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { useTranslation } from 'react-i18next';

const { ErrorInfoCard, ErrorLoader } = DS;

const Routes: React.FC<RootComponentProps & { errors: any }> = props => {
  const { errors, sdkModules, globalChannel, logger } = props;
  const { t } = useTranslation();
  
  return (
    <ErrorInfoCard errors={errors}>
      {(errorMessages, hasCriticalErrors) => (
        <>
          {errorMessages && (
            <ErrorLoader
              type="script-error"
              title={t('There was an error loading your 3Box settings')}
              details={t('We cannot show 3Box settings right now')}
              devDetails={errors}
            />
          )}
          {!hasCriticalErrors && (
            <Router>
              <Switch>
                <Route path={subRoutes[EDIT_PAGE]}>
                  <MyBoxProfile
                    sdkModules={sdkModules}
                    globalChannel={globalChannel}
                    logger={logger}
                  />
                </Route>
                <Route path={subRoutes[SETTINGS_PAGE]}>
                  <BoxSettings
                    sdkModules={sdkModules}
                    globalChannel={globalChannel}
                    logger={logger}
                  />
                </Route>
                {/* this route is not in menuItems because we don't have a explore functionality for 3box yet */}
                <Route path={`${rootRoute}/profile/:profileId`}>
                  <BoxProfile
                    sdkModules={sdkModules}
                    globalChannel={globalChannel}
                    logger={logger}
                  />
                </Route>
                {/* Make the edit page default landing page for this app
                          404 routes gets redirected to this page also */}
                <Redirect push={true} from={rootRoute} to={subRoutes[EDIT_PAGE]} exact={true} />
              </Switch>
            </Router>
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default Routes;

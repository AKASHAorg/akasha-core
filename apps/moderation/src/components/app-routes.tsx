import * as React from 'react';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import DS from '@akashaproject/design-system';

import routes, { HOME, rootRoute } from '../routes';

import ContentList from './content-list';

const { Box, ViewportSizeProvider } = DS;

const AppRoutes: React.FC<RootComponentProps> = props => {
  const { layout } = props;

  return (
    <ViewportSizeProvider>
      <Box>
        <Router>
          <Switch>
            <Route path={routes[HOME]}>
              <ContentList
                slotId={layout.app.modalSlotId}
                // sdkModules={sdkModules}
                // globalChannel={globalChannel}
                // logger={logger}
                // navigateToUrl={singleSpa.navigateToUrl}
                // showLoginModal={showLoginModal}
                // onError={onError}
              />
            </Route>
            <Redirect exact={true} from={rootRoute} to={routes[HOME]} />
          </Switch>
        </Router>
      </Box>
    </ViewportSizeProvider>
  );
};

export default AppRoutes;

import { Grommet, responsiveBreakpoints, Box } from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyProfilePage from './my-profile';
import ProfilePage from './profile-page';
import WidgetList from '../widgets';
import Grid from '../grid';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const [t] = useTranslation();
  return (
    <>
      <Router>
        <Grommet theme={responsiveBreakpoints} style={{ height: '100%' }}>
          <Grid>
            {(gridConfig: any) => {
              const widgetAreaProps = {
                gridArea: gridConfig.gridAreas.widgetList,
                style: {},
              };
              if (gridConfig.size === 'small') {
                widgetAreaProps.style = {
                  display: 'none',
                };
              }
              return (
                <>
                  <Box gridArea={gridConfig.gridAreas.pluginContent}>
                    <Switch>
                      <Route path={`${path}/list`} render={() => <>A list of profiles</>} />
                      <Route path={`${path}/my-profile`} component={MyProfilePage} />
                      <Route path={`${path}/:profileId`} component={ProfilePage} />
                      <Route render={() => <div>{t('Profile not found!')}</div>} />
                    </Switch>
                  </Box>
                  <Box {...widgetAreaProps}>
                    <WidgetList />
                  </Box>
                </>
              );
            }}
          </Grid>
        </Grommet>
      </Router>
    </>
  );
};

export default Routes;

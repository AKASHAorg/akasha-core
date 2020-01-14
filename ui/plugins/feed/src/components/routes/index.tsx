import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Grid from '../grid';
import FeedHomePage from './feed-home-page';

const { Grommet, responsiveBreakpoints, Box } = DS;

export interface IRoutesProps {
  activeWhen: { path: string };
}

const ArticleNotFound = () => {
  const { t } = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const activeWhenPath = path.slice(0, path.lastIndexOf('/'));
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
                      <Route exact={true} path={`${activeWhenPath}`} component={FeedHomePage} />
                      <Route component={ArticleNotFound} />
                    </Switch>
                  </Box>
                  <Box {...widgetAreaProps}>
                    <></>
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

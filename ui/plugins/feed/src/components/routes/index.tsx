import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ArticlePage from './articles-home-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const activeWhenPath = path.slice(0, path.lastIndexOf('/'));
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact={true}
            path={`${activeWhenPath}/article/:articleId`}
            component={ArticlePage}
          />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

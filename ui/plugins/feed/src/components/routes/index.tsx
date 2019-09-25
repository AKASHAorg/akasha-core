import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ArticlePage from './article-page';
import ArticlesHomePage from './articles-home-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const [t] = useTranslation();
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path={`${activeWhen.path}`}
            children={({ match }) => <ArticlesHomePage rootPath={activeWhen.path} match={match} />}
          />
          <Route exact path={`${activeWhen.path}/:articleId`} component={ArticlePage} />
          <Route render={() => <div>{t('Article not found!')}</div>} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

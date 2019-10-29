import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ArticlePage from './article-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const activeWhenPath = path.slice(0, path.lastIndexOf('/'));
  const [t] = useTranslation();
  return (
    <>
      <Router>
        <Switch>
          <Route exact path={`${activeWhenPath}/article/:articleId`} component={ArticlePage} />
          <Route render={() => <div>{t('Article not found!')}</div>} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

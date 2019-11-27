import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import ArticlePage from './article-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const ArticleNotFound = () => {
  const [t] = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

const Routes: React.FC<IRoutesProps> = () => {
  // const { activeWhen } = props;
  // const { path } = activeWhen;
  // const activeWhenPath = path.slice(0, path.lastIndexOf('/'));
  return (
    <>
      <Router>
        <Switch>
          {/* <Route
            exact={true}
            path={`${activeWhenPath}/article/:articleId`}
            component={ArticlePage}
          /> */}
          <Route component={ArticleNotFound} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

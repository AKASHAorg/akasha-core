import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ArticlePage from './article-page';
import ArticlesHomePage from './articles-home-page';
import MyProfilePage from './my-profile';
import ProfilePage from './profile-page';

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
          <Route
            exact={true}
            path={`${activeWhen.path}`}
            children={({ match }) => <ArticlesHomePage rootPath={activeWhen.path} match={match} />}
          />
          <Route path={`${activeWhenPath}/profile/my-profile`} component={MyProfilePage} />
          <Route path={`${activeWhenPath}/profile/:profileId`} component={ProfilePage} />
          <Route
            exact={true}
            path={`${activeWhenPath}/article/:articleId`}
            component={ArticlePage}
          />
          <Route render={() => <div>{t('Article not found!')}</div>} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

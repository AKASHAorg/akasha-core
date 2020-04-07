import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WidgetList from '../widgets';
import FeedHomePage from './feed-home-page';

const { Box, styled } = DS;

export interface IRoutesProps {
  activeWhen: { path: string };
  singleSpa: any;
}

const ArticleNotFound = () => {
  const { t } = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

const FeedBox = styled(Box)`
  padding: 0.5em 0;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 60%;
    width: 100%;
  }
`;

const WidgetBox = styled(Box)`
  padding: 0.5em 0;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 40%;
    width: 100%;
    margin: 0 1em;
  }
`;

const Feed = styled(Box)`
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { path } = activeWhen;
  const activeWhenPath = path.slice(0, path.lastIndexOf('/'));
  return (
    <Router>
      <Feed>
        <FeedBox>
          <Switch>
            <Route exact={true} path={`${activeWhenPath}`} component={FeedHomePage} />
            <Route component={ArticleNotFound} />
          </Switch>
        </FeedBox>
        <WidgetBox>
          <WidgetList />
        </WidgetBox>
      </Feed>
    </Router>
  );
};

export default Routes;

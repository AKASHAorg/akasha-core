import DS from '@akashaproject/design-system';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WidgetList from '../widgets';
import FeedHomePage from './feed-home-page';

const { Grommet, lightTheme, Box, styled } = DS;

export interface IRoutesProps {
  activeWhen: { path: string };
}

const ArticleNotFound = () => {
  const { t } = useTranslation();
  return <div>{t('Article not found!')}</div>;
};

const FeedBox = styled(Box)`
  padding: 0.5em 0;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
    max-width: 60%;
  }
`;

const WidgetBox = styled(Box)`
  padding: 0.5em 0;
  padding-left: 0.5em;
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px){
    max-width: 40%;
  }
`;

const Feed = styled(Box)`
  @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px){
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
      <Grommet theme={lightTheme}>
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
      </Grommet>
    </Router>
  );
};

export default Routes;

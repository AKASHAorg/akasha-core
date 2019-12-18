import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EventPage from './event-page';
import EventsHomePage from './events-home-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  const { t } = useTranslation();
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact={true}
            path={`${activeWhen.path}`}
            children={({ match }) => <EventsHomePage rootPath={activeWhen.path} match={match} />}
          />
          <Route exact={true} path={`${activeWhen.path}/:eventId`} component={EventPage} />
          <Route render={() => <div>{t('Event not found!')}</div>} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

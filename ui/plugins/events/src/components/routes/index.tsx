import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EventPage from './event-page';
import EventsHomePage from './events-home-page';

export interface IRoutesProps {
  activeWhen: { path: string };
}

const Routes: React.FC<IRoutesProps> = props => {
  const { activeWhen } = props;
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path={`${activeWhen.path}`}
            children={({ match }) => <EventsHomePage rootPath={activeWhen.path} match={match} />}
          />
          <Route exact path={`${activeWhen.path}/:eventId`} component={EventPage} />
          <Route render={() => <div>Event not found</div>} />
        </Switch>
      </Router>
    </>
  );
};

export default Routes;

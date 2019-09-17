import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, match } from 'react-router-dom';
import { useEvents } from '../reducers/events';

export interface IEventHomePageProps {
  rootPath: string;
  match: match<any> | null;
}

/* Remove this */
const randomArr = (size: number, max: number) =>
  [...new Array(size)].map(() => Math.round(Math.random() * max));
/* Remove this ^^^ */

const EventHomePage: React.FC<IEventHomePageProps> = () => {
  const [t] = useTranslation();
  const [eventsState, eventDispatch] = useEvents();
  const fetchMoreEvents = (ev: React.SyntheticEvent) => {
    const events = randomArr(3, 100).map(num => ({
      name: `Random Event ${num}`,
      href: `/events/old-event-${num}`,
    }));
    eventDispatch({
      type: 'GET_MORE_EVENTS',
      payload: events,
    });
    ev.preventDefault();
  };
  return (
    <div>
      {t('Events List')}
      {eventsState.events.map(event => (
        <div key={event.href}>
          <span>
            {t('common:Name')} <Link to={{ pathname: `${event.href}` }}>{event.name}</Link>
          </span>
        </div>
      ))}
      <button onClick={fetchMoreEvents}>Get more</button>
    </div>
  );
};

export default EventHomePage;

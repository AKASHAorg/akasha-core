import * as React from 'react';
import { match as matchType, RouteComponentProps } from 'react-router';

export interface IEventPageProps {
  match: matchType;
}

const EventPage: React.FC<IEventPageProps & RouteComponentProps<{ eventId: string }>> = props => {
  const { match } = props;
  const { params } = match;
  return <div>Event Page with id: {params.eventId}</div>;
};

export default EventPage;

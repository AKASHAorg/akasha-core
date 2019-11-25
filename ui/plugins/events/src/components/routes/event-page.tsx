import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { match as matchType, RouteComponentProps } from 'react-router-dom';

export interface IEventPageProps {
  match: matchType;
}

const EventPage: React.FC<IEventPageProps & RouteComponentProps<{ eventId: string }>> = props => {
  const [t] = useTranslation();
  const { match } = props;
  const { params } = match;
  return (
    <div>
      {t('Event page with id')}: {params.eventId}
    </div>
  );
};

export default EventPage;

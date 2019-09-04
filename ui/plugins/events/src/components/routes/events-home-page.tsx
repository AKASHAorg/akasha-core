import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, match } from 'react-router-dom';

export interface IEventHomePageProps {
  rootPath: string;
  match: match<any> | null;
}

const EventHomePage: React.FC<IEventHomePageProps> = props => {
  const { rootPath } = props;
  const [t] = useTranslation();
  return (
    <div>
      {t('Events List')}
      <div>
        <Link to={{ pathname: `${rootPath}/my-event` }}>{t('common:Events')} 1</Link>
      </div>
      <div>
        <Link to={`${rootPath}/123`}>{t('An Event')} 2</Link>
      </div>
      <div>
        <Link to={`${rootPath}/125`}>{t('Event')} 3</Link>
      </div>
      <div>
        <Link to={`${rootPath}/not/found/event`}>{t('Not.found.event')}</Link>
      </div>
    </div>
  );
};

export default EventHomePage;

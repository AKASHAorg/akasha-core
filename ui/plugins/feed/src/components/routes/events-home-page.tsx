import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, match } from 'react-router-dom';
import { useArticles } from '../state/articles';

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
  const [articleState, articleActions] = useArticles();
  const fetchMoreEvents = (ev: React.SyntheticEvent) => {
    const events = randomArr(3, 100).map(num => ({
      name: `Random Event ${num}`,
      href: `/events/old-event-${num}`,
    }));
    articleActions.GET_MORE_EVENTS(events);
    ev.preventDefault();
  };
  return (
    <div>
      {t('Events List')}
      {articleState.articles.map(article => (
        <div key={article.href}>
          <span>
            {t('common:Name')} <Link to={{ pathname: `${article.href}` }}>{article.name}</Link>
          </span>
        </div>
      ))}
      <button onClick={fetchMoreEvents}>Get more</button>
    </div>
  );
};

export default EventHomePage;

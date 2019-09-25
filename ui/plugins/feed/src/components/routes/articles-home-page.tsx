import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, match } from 'react-router-dom';
import { useArticles } from '../state/articles';

export interface IArticlesHomePageProps {
  rootPath: string;
  match: match<any> | null;
}

/* Remove this */
const randomArr = (size: number, max: number) =>
  [...new Array(size)].map(() => Math.round(Math.random() * max));
/* Remove this ^^^ */

const ArticlesHomePage: React.FC<IArticlesHomePageProps> = () => {
  const [t] = useTranslation();
  const [articleState, articleActions] = useArticles();
  const fetchMoreArticles = (ev: React.SyntheticEvent) => {
    const articles = randomArr(3, 100).map(num => ({
      title: `Random Article ${num}`,
      href: `/article/old-event-${num}`,
    }));
    articleActions.getMoreArticles({ articles });
    ev.preventDefault();
  };
  return (
    <div>
      {t('Articles List')}
      {articleState.articles.map(article => (
        <div key={article.href}>
          <span>
            {t('common:Title')} <Link to={{ pathname: `${article.href}` }}>{article.title}</Link>
          </span>
        </div>
      ))}
      <button onClick={fetchMoreArticles}>Get more</button>
    </div>
  );
};

export default ArticlesHomePage;

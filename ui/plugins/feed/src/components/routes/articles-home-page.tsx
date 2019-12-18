import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useArticles } from '../state/articles';

export interface IArticlesHomePageProps {
  rootPath: string;
}

const ArticlesHomePage: React.FC<IArticlesHomePageProps> = () => {
  const [t] = useTranslation();
  const [articleState] = useArticles();
  const fetchMoreArticles = (ev: React.SyntheticEvent) => {
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
      <div>
        <button onClick={fetchMoreArticles}>Get more</button>
      </div>
    </div>
  );
};

export default ArticlesHomePage;

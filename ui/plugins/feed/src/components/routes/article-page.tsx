import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router-dom';

export interface IArticlePageProps {}

const ArticlePage: React.FC<IArticlePageProps> = () => {
  const [t] = useTranslation();
  const match = useRouteMatch<{ articleId: string }>();
  const { params } = match;
  return (
    <div>
      {t('Article page with id')}: {params.articleId}
    </div>
  );
};

export default ArticlePage;

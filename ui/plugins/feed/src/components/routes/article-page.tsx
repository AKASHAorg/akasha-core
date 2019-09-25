import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { match as matchType, RouteComponentProps } from 'react-router';

export interface IArticlePageProps {
  match: matchType;
}

const ArticlePage: React.FC<
  IArticlePageProps & RouteComponentProps<{ articleId: string }>
> = props => {
  const [t] = useTranslation();
  const { match } = props;
  const { params } = match;
  return (
    <div>
      {t('Article page with id')}: {params.articleId}
    </div>
  );
};

export default ArticlePage;

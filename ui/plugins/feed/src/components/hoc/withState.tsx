import * as React from 'react';
import { useArticles } from '../state/articles';

export const withProfileState = (Component: React.ComponentType) => (props: any) => {
  const [articlesState, articlesActions] = useArticles();
  return <Component articleState={articlesState} articleActions={articlesActions} {...props} />;
};

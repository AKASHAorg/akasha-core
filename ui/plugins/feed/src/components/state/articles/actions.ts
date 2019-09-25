import { IAction } from '../interfaces';
import { actionTypes } from './types';

export const getArticlesActions = (
  dispatch: React.Dispatch<IAction<any, any>>,
  types: typeof actionTypes,
) => ({
  getArticles: (payload: any) => dispatch({ type: types.GET_ARTICLES, payload }),
  getMoreArticles: (payload: any) => dispatch({ type: types.GET_MORE_ARTICLES, payload }),
});

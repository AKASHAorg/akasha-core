import { IAction } from '../interfaces';
import { actionTypes } from './types';

export const getArticlesActions = (dispatch: React.Dispatch<IAction<any, string>>) => ({
  getArticles: (payload: any) => dispatch({ type: actionTypes.GET_ARTICLES, payload }),
  getMoreArticles: (payload: any) => dispatch({ type: actionTypes.GET_MORE_ARTICLES, payload }),
});

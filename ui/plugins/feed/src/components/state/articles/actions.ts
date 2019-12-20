import { IAction } from '../interfaces';
import { actionTypes } from './types';

export const getArticlesActions = (dispatch: React.Dispatch<IAction<any, string>>) => ({
  getArticles: (payload: any) => dispatch({ payload, type: actionTypes.GET_ARTICLES }),
  getMoreArticles: (payload: any) => dispatch({ payload, type: actionTypes.GET_MORE_ARTICLES }),
});

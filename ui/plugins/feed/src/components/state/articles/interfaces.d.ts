import { IAction } from '../interfaces';

interface IArticlesState {
  articles: any[];
  activeFilter: string;
}

export type ArticlesAction = IAction<any, typeof actionTypes>;

export type Reducer = (state: IArticlesState, action: ArticlesAction) => IArticlesState;

export type UseValueType = (
  props: any,
) => [IArticlesState, { [key in keyof typeof actionTypes]: (payload: any) => void }];

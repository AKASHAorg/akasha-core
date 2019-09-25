import { useReducer } from 'react';
import { createContainer } from 'react-tracked';
import { handleActions } from '../handle-actions';
import { getArticlesActions } from './actions';
import { IArticlesState, Reducer, UseValueType } from './interfaces';
import { actionTypes } from './types';

export const articlesState: IArticlesState = {
  articles: [],
  activeFilter: 'latest',
};

export function articlesInit(initialValues?: Partial<IArticlesState>): IArticlesState {
  return {
    ...articlesState,
    ...initialValues,
  };
}

export const articlesReducer: Reducer = handleActions<typeof actionTypes, IArticlesState, any>(
  {
    GET_ARTICLES: (draft, payload) => {
      draft.articles = payload;
      return draft;
    },
    GET_MORE_ARTICLES: (draft, payload) => {
      draft.articles = draft.articles.concat(payload);
      return draft;
    },
    CHANGE_FILTER: (draft, payload) => {
      draft.activeFilter = payload;
      return draft;
    },
    // test same action in different reducers..
    CLEANUP: () => articlesState,
  },
  articlesState,
);

const useValue: UseValueType = ({
  reducer,
  initialState,
  init,
}: {
  reducer: Reducer;
  initialState: IArticlesState;
  init: (initial: Partial<IArticlesState>) => IArticlesState;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState, init);
  const actions = getArticlesActions(dispatch, actionTypes);
  return [state, actions];
};

export const {
  Provider: ArticlesProvider,
  useTracked: useArticles,
  useTrackedState: useArticlesState,
  useUpdate: useArticlesUpdate,
  useSelector: useArticlesSelector,
} = createContainer(useValue);

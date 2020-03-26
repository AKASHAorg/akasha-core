import { produce, Draft } from 'immer';
import { IAction } from './interfaces';

export function handleActions<T, S, P>(
  actionsMap: {
    [key in keyof T]: (draft: Draft<S>, payload: P) => S | void;
  },
  defaultState: S,
) {
  return function rev(state = defaultState, dispatchedAction: IAction<P, keyof typeof actionsMap>) {
    const action = actionsMap[dispatchedAction.type];
    if (action) {
      return produce(state, draft => action(draft, dispatchedAction.payload));
    }
    throw new Error('Looks like the action is not found!');
  };
}

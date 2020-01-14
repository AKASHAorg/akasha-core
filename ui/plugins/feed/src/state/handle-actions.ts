import { produce } from 'immer';
import { IAction } from './interfaces';

export function handleActions<T, S, P>(
  actionsMap: {
    [key in keyof T]: (state: S, payload: P) => S;
  },
  defaultState: S,
) {
  return function rev(state = defaultState, dispatchedAction: IAction<P, keyof typeof actionsMap>) {
    return produce(state, (draft: S) => {
      const action = actionsMap[dispatchedAction.type];
      if (action) {
        return action(draft, dispatchedAction.payload);
      }
      throw new Error('Looks like the action is not found!');
    });
  };
}

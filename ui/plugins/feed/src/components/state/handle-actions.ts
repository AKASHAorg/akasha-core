import { produce } from 'immer';

export function handleActions<T, S, P>(
  actionsMap: {
    [key in keyof T]: (state: S, payload: P) => S | void;
  },
  defaultState: S,
) {
  return function rev(state = defaultState, { type, payload }: { type: keyof T; payload: P }) {
    return produce(state, (draft: S) => {
      const action = actionsMap[type];
      if (action) {
        return action(draft, payload);
      }
      throw new Error('Looks like the action is not found!');
    });
  };
}

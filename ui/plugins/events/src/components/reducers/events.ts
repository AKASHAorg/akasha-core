import React from 'react';
import { createContainer } from 'react-tracked';
import { handleActions } from './handle-actions';
import { IAction } from './interfaces';

interface IEventsState {
  events: any[];
  activeFilter: string;
}

type EventsAction = IAction<any, keyof typeof actionTypes>;

type Reducer = (state: IEventsState, action: EventsAction) => IEventsState;

export const eventsState: IEventsState = {
  events: [],
  activeFilter: 'latest',
};

export const actionTypes = {
  GET_EVENTS: 'GET_EVENTS',
  GET_MORE_EVENTS: 'GET_MORE_EVENTS',
  CHANGE_FILTER: 'EVENTS_FILTER',
  CLEANUP: 'CLEANUP',
};

export function eventsInit(initialValues?: Partial<IEventsState>): IEventsState {
  return {
    ...eventsState,
    ...initialValues,
  };
}

export const eventsReducer: Reducer = handleActions<typeof actionTypes, IEventsState, any>(
  {
    GET_EVENTS: (draft, payload) => {
      draft.events = payload;
      return draft;
    },
    GET_MORE_EVENTS: (draft, payload) => {
      draft.events = draft.events.concat(payload);
      return draft;
    },
    CHANGE_FILTER: (draft, payload) => {
      draft.activeFilter = payload;
      return draft;
    },
    // test same action in different reducers..
    CLEANUP: () => eventsState,
  },
  eventsState,
);

const useValue = ({
  reducer,
  initialState,
}: {
  reducer: Reducer;
  initialState: IEventsState;
}): [IEventsState, React.Dispatch<EventsAction>] => React.useReducer(reducer, initialState);

export const {
  Provider: EventsProvider,
  useTracked: useEvents,
  useTrackedState: useEventsState,
  useUpdate: useEventsUpdate,
  useSelector: useEventsSelector,
} = createContainer(useValue);

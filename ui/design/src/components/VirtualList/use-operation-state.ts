import React, { Reducer } from 'react';
import { IFetchOperation, ISliceOperation } from './interfaces';

export interface IOperationState {
  fetchOperation: IFetchOperation | null;
  sliceOperation: ISliceOperation | null;
}

type IOpActionData =
  | { type: 'SET_FETCH_OP'; payload: any }
  | { type: 'UPDATE_FETCH_OP'; payload: any }
  | { type: 'SET_SLICE_OP'; payload: any };

const opReducer = (state: IOperationState, actionData: IOpActionData): IOperationState => {
  switch (actionData.type) {
    case 'SET_FETCH_OP':
      return { ...state, fetchOperation: actionData.payload };
    case 'UPDATE_FETCH_OP':
      return { ...state, fetchOperation: { ...state.fetchOperation, ...actionData.payload } };
    case 'SET_SLICE_OP':
      return { ...state, sliceOperation: actionData.payload };
    default:
      throw new Error(`handler for actionType: ${actionData} is not defined`);
  }
};

const useOperationState = () => {
  const [state, dispatch] = React.useReducer<Reducer<IOperationState, IOpActionData>>(opReducer, {
    fetchOperation: null,
    sliceOperation: null,
  });
  const actions = {
    createFetchOperation: (operationData: IFetchOperation) =>
      dispatch({ type: 'SET_FETCH_OP', payload: operationData }),
    updateFetchOperation: (updates: Partial<IFetchOperation>) =>
      dispatch({ type: 'UPDATE_FETCH_OP', payload: updates }),
    createSliceOperation: (operationData: ISliceOperation) =>
      dispatch({ type: 'SET_SLICE_OP', payload: operationData }),
  };
  return [state, actions];
};

export default useOperationState;

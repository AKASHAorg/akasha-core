import * as React from 'react';
import { IFetchOperation } from './interfaces';

export interface IBoundryLoaderProps {
  chrono: 'upper' | 'lower';
  onLoadMore: (payload: any, deps: any) => void;
  fetchOperation: IFetchOperation | null;
  setFetchOperation: React.Dispatch<IFetchOperation | null>;
  height: number;
}

/*
 * Takes a queue
 * filters it by op === 'fetch'
 * fetches the remote data
 * sets operation's status to 'requested'
 */
const BoundryLoader = (props: IBoundryLoaderProps) => {
  const { fetchOperation, setFetchOperation, height, onLoadMore } = props;

  const reqPayload: { start: string | null; limit: number | null; reverse: boolean | null } = {
    start: null,
    limit: null,
    reverse: null,
  };

  if (fetchOperation && fetchOperation.status === 'pending') {
    reqPayload.start = fetchOperation.startId;
    reqPayload.limit = fetchOperation.size;
    reqPayload.reverse = fetchOperation.position === 'start' ? true : false;
    setFetchOperation({
      ...fetchOperation,
      status: 'requested',
    });
  }
  onLoadMore(reqPayload, [JSON.stringify(reqPayload)]);

  return <div style={{ height }} />;
};

export default React.memo(BoundryLoader, (prevProps, props) => {
  if (prevProps.height !== props.height) {
    return false;
  }
  if (JSON.stringify(prevProps.fetchOperation) === JSON.stringify(props.fetchOperation)) {
    return true;
  }

  return false;
});

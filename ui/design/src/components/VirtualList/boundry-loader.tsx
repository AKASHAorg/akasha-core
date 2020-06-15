import * as React from 'react';
import isEqual from 'react-fast-compare';
import { IFetchOperation } from './interfaces';

export interface IBoundryLoaderProps {
  chrono: 'upper' | 'lower';
  onLoadMore: (payload: { start?: string; limit: number; reverse: boolean }) => void;
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

  const reqPayload: { start?: string; limit: number; reverse: boolean } = {
    start: undefined,
    limit: 5,
    reverse: false,
  };
  React.useEffect(() => {
    if (fetchOperation && fetchOperation.status === 'pending') {
      reqPayload.start = fetchOperation.startId;
      reqPayload.limit = fetchOperation.size;
      reqPayload.reverse = fetchOperation.position === 'start' ? true : false;
      setFetchOperation({
        ...fetchOperation,
        status: 'requested',
      });
      onLoadMore(reqPayload);
    }
  }, [fetchOperation ? fetchOperation.status : fetchOperation]);

  return <div style={{ height }} />;
};

export default React.memo(BoundryLoader, (prevProps, props) => {
  if (prevProps.height !== props.height) {
    return false;
  }
  if (isEqual(prevProps.fetchOperation, props.fetchOperation)) {
    return true;
  }

  return false;
});

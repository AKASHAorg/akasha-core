import * as React from 'react';
import { isIntersecting } from '../../utils/virtual-list';
import ListEngine, { UpdatePayload } from './list';

export interface UseVirtualScrollProps {
  avgItemHeight: number;
  spacing: number;
  items: string[];
  slice: [number, number];
  coords?: { [key: string]: { top: number; height: number } };
  startId?: string;
  offsetItems: number;
  loadMore: (payload: any) => void;
  hasMoreItems: boolean;
}

const reducer = (state: any, action: UpdatePayload) => {
  switch (action.type) {
    case 'SET_TOTAL_ITEMS_HEIGHT':
      if (state.totalItemsHeight !== action.payload) {
        return {
          ...state,
          totalItemsHeight: action.payload,
        };
      }
      return state;
    case 'SET_COORDINATES':
      return {
        ...state,
        coordinates: action.payload,
      };
    case 'UPDATE_COORDINATE':
      return {
        ...state,
        coordinates: { ...state.coordinates, ...{ [action.payload.id]: action.payload.rect } },
      };
    case 'SET_SLICE':
      return {
        ...state,
        slice: action.payload.slice,
      };
    case 'CREATE_FETCH_OP':
      if (!state.fetchOp.status || (state.fetchOp.status && state.fetchOp.status === 'completed')) {
        return {
          ...state,
          fetchOp: action.payload,
        };
      }
      return state;
    case 'SET_FETCH_OP':
      return {
        ...state,
        fetchOp: action.payload,
      };
    default:
      return state;
  }
};
const useVirtualScroll = (props: UseVirtualScrollProps) => {
  const {
    avgItemHeight = 200,
    spacing = 8,
    items,
    slice,
    offsetItems,
    loadMore,
    hasMoreItems,
  } = props;
  const [state, dispatch] = React.useReducer(reducer, {
    slice,
    totalItemsHeight: 0,
    coordinates: {},
    fetchOp: {},
  });

  const listEngine = React.useRef(
    new ListEngine({
      avgItemHeight,
      spacing,
      offsetItems,
      slice,
      hasMoreItems,
    }),
  );

  React.useEffect(() => {
    const unlisteners = listEngine.current.init({
      items,
      slice: props.slice || [0, Math.max(0, props.items.length - 1)],
      coords: props.coords || {},
      onUpdate: (type: any, payload) => {
        dispatch({ type, payload });
      },
    });
    return () => {
      unlisteners.forEach(unlistener => {
        unlistener();
      });
    };
  }, []);
  const handlers = {
    onItemSizeUpdate: (itemId: string, size: { top: number; height: number }) => {
      listEngine.current.updateItemRect(itemId, size);
    },
    setHasMoreItems: (hasMore: boolean) => {
      listEngine.current.setHasMoreItems(hasMore);
    },
  };
  React.useEffect(() => {
    if (state.fetchOp && state.fetchOp.status === 'pending') {
      loadMore(state.fetchOp.req);
      dispatch({ type: 'SET_FETCH_OP', payload: { ...state.fetchOp, status: 'requested' } });
    }
  }, [state.fetchOp]);

  React.useEffect(() => {
    if (items.length > listEngine.current.items.length) {
      const isTop =
        listEngine.current.items.length > 0 &&
        JSON.stringify(items[0]) !== JSON.stringify(listEngine.current.items[0]);
      if (isTop) {
        listEngine.current.addItems(
          items.slice(0, items.indexOf(listEngine.current.items[0])),
          'top',
        );
        if (
          state.fetchOp.req &&
          state.fetchOp.req.reverse &&
          state.fetchOp.status === 'requested'
        ) {
          dispatch({ type: 'SET_FETCH_OP', payload: { ...state.fetchOp, status: 'completed' } });
        }
      } else {
        listEngine.current.addItems(items.slice(listEngine.current.items.length));
        if (
          state.fetchOp.req &&
          !state.fetchOp.req.reverse &&
          state.fetchOp.status === 'requested'
        ) {
          dispatch({ type: 'SET_FETCH_OP', payload: { ...state.fetchOp, status: 'completed' } });
        }
      }
      const intersectingCoord = listEngine.current.items.slice(slice[0]).find(id => {
        const coord = listEngine.current.coords[id];
        if (coord) {
          return isIntersecting(coord, listEngine.current.viewport.getRect());
        }
        return false;
      });
      const isInitialLoad = intersectingCoord === items[0];
      if (isInitialLoad) {
        listEngine.current.updateSlice(0, items.length);
      }
    }
  }, [items.length, JSON.stringify(state.fetchOp)]);
  React.useEffect(() => {
    if (!items.length) {
      dispatch({
        type: 'SET_FETCH_OP',
        payload: {
          req: { start: state.startId, reverse: false, limit: offsetItems + 3 },
          status: 'pending',
        },
      });
    }
  }, []);
  return [state, handlers];
};

export default useVirtualScroll;

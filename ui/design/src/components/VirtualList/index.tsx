import VirtualList from './virtual-list';

/* ************************
 *
 *  Virtual Scroll List Component
 *  How it works:
 *    - initial request to load items if the `initialState` prop is not provided
 *    - subsequent requests to resolve items is made by each item
 *    - a ref is passed to the nth item from top (configurable via `offsetItems: number`)
 *    - an additional ref is passed to the nth item from bottom (configurable via `offsetItems: number`)
 *    - an intersection observer is used to track these
 *        2 refs (signalling when the top ref is out of viewport / bottom ref entered viewport)
 *
 *    When User is Scrolling down:
 *      - when top ref signal (leaving the viewport) is received
 *        - QueueOperator component will calculate the total list height without `offsetItems`
 *        - QueueOperator will mark those items for deletion
 *        - ListOperator will apply the changes in queue when the first insert is received (more to explain later)
 *      - top ref will move to the next nth item
 *      - when bottom ref signal (entering the viewport) is received
 *        - QueueOperator will calculate the items height below the ref's index
 *        - QueueOperator will add an entry to `requestMore` queue if there are no more entries in the `items` prop
 *        - BoundryLoader Component will trigger the request and some component upper
 *          in hierarchy will empty the requestMore queue when the items are received
 *        - bottom ref will move the the next nth item
 *     When User is Scrolling up:
 *        - wip (basically is the inverse of the scrolling down scenario)
 *
 *     When a adnotation is received:
 *     When a new session begins (refresh)
 *     When user navigates to other pages and returns (back-button):
 *     When a new item is available (published):
 *
 * ************************/

export default VirtualList;

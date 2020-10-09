## Virtual List component

-----
- initialize state based on passed prop
  - initialState: {}
- make the first fetch (take initialState into account)
- load more items if needed
- watch elements when they are entering the viewport
  - split the list in 3 "ranges" - topRange, viewportRange, bottomRange - and 2 padding elements
    <paddingElement> - the height of the removed elements
    <topRange> - contains elements that are out of view but still in document
    <viewport> - viewable elements
    <bottomRange> - contains elements that are out of view but still in document
    <paddingElement> - the height of the removed elements

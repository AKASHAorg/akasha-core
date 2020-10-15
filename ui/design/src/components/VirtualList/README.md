## Virtual List component

-----
- initialize state based on passed prop
  - initialState: {}
- make the first fetch (take initialState into account)
- load more items if needed
- watch elements when they are entering the viewport
    <wrapper min-height> - the height of the total elements
    <viewport> - viewable elements
    <paddingElement> - the height of the total elements

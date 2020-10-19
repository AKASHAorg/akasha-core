# Sidebar widget

## Usage

```tsx
import AppLoader from '@akashaproject/ui-plugin-loader';
import LayoutWidget from '@akashaproject/ui-widget-layout';
import SidebarWidget from '@akashaproject/ui-widget-sidebar';

// ...
const app = new AppLoader({
  layout: LayoutWidget,
});
// layout should expose a sidebarSlotId: string param
app.registerWidget(SidebarWidget, { slot: LayoutWidget.sidebarSlotId });

app.start();
```

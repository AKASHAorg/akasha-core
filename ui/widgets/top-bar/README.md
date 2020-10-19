# Top Bar widget

## Usage

```tsx
import AppLoader from '@akashaproject/ui-plugin-loader';
import LayoutWidget from '@akashaproject/ui-widget-layout';
import TopbarWidget from '@akashaproject/ui-widget-topbar';

// ...
const app = new AppLoader({
  layout: LayoutWidget,
});
// layout should expose a topbarSlotId: string param
app.registerWidget(TopbarWidget, { slot: LayoutWidget.topbarSlotId });

app.start();
```

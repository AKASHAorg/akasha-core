# Mini Profile widget

> Mini Profile widget is an app-specific widget, shown on the widget section of the world's layout when the [Antenna App](../../apps/antenna/README.md) is mounted. It displays profile summary of the author of a Beam or Reflection.

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaorg/ui-widget-mini-profile',
  ]
});

```

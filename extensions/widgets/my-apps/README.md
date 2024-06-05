# My Apps widget

> My Apps widget is an app-specific widget, shown on the widget section of the world's layout when the [Extensions App](../../apps/extensions/README.md) is mounted. It displays information regarding user installed apps, as well as world apps.

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaorg/ui-widget-my-apps',
  ]
});

```

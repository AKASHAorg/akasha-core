# My Apps widget

> Shows world apps and installed apps in the integration center.

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaproject/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaproject/ui-widget-my-apps',
  ]
});

```

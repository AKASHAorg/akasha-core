# Layout widget

> Layout widget defines and controls the sizing and styling of various sections of the screen upon which other apps, widgets and plugins are mounted. It also sets up the [translation plugin](./src/translation/index.tsx)

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');

startLoader({
  layout: '@akashaorg/ui-widget-layout',
});
```

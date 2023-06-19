# Sidebar widget

> Shows currently installed app(s), akasha-verse and other quick access icons

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaorg/ui-widget-sidebar',
  ]
});

```

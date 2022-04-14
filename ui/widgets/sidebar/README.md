# Sidebar widget

> Shows currently installed app(s), app-center and other quick access icons

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaproject/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaproject/ui-widget-sidebar',
  ]
});

```

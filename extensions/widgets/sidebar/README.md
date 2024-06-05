# Sidebar widget

> Sidebar widget displays information regarding currently installed app(s), authenticated user's profile avatar and other quick access links.

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaorg/ui-widget-sidebar',
  ]
});

```

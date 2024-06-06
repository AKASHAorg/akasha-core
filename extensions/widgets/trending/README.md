# Trending Widget

> Trending widgets show most-used tags (sorted in order of descending count) and profiles (sorted in chronological order)

## Usage

```tsx
const { default: startLoader } = await System.import('@akashaorg/ui-app-loader');

startLoader({
  defaultWidgets: [
    '@akashaorg/ui-widget-trending',
  ]
});

```

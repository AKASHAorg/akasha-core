# Analytics Widget

> Analytics widget renders the `Cookies banner` which collects users' consent on whether or not, they wish to allow tracking. It checks if analytics is specified in the `worldConfig` object, then depending on the user's choice, installs the required scripts.

## Usage

```tsx
  const eventSub = useRef(null);
  const analyticsConfig = useRef(worldConfig.analytics);
  const _uiEvents = useRef(uiEvents);

  // if consent to track is given;
  if (analyticsConfig.current) {
    installTrackingScript(analyticsConfig.current);
    enableTracking();
    installPageTacking();
    eventSub.current = registerEventBusSubscriber(_uiEvents.current);
  }
```

 The hook [useAnalytics](../../../libs/hooks/src/use-analytics.tsx) then provides a `trackEvent` method that is useful in tracking events across the app.

```tsx
  const [analyticsActions] = useAnalytics();

  analyticsActions.trackEvent({
      category: AnalyticsCategories.FILTER_SEARCH,
      action: subscribe ? 'Trending Topic Subscribed' : 'Trending Topic Unsubscribed',
    });
```
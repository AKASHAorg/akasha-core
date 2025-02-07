# Hooks

This package contains all hooks required for proper functioning of the AKASHA Core

## Available Hooks

### [useAnalytics](./src/use-analytics.tsx)

> handles user consent to tracking and analytics functions. Available actions include;

- enableTracking
- acceptConsent
- rejectConsent
- trackEvent

### [useLegal](./src/use-legal.ts)

> handles retrieval of legal docs from IPFS service. Available actions include;

- getLegalDoc

### [useNotifications](./src/use-notifications.ts)

> handles enabling of notifications and exposes status of pending signature request.
> Available actions include;

- enableNotifications


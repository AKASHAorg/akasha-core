# AWF Hooks

This package contains all hooks required for proper functioning of the AKASHA Core

## Available Hooks

### [useAnalytics](./src/use-analytics.ts)

> handles user consent to tracking and analytics functions. Available actions include;

- enableTracking
- acceptConsent
- rejectConsent
- trackEvent

### [useGlobalLogin](./src/use-global-login.ts)

> handles actions triggered right after user logs in or out of the app.

### [useLegal](./src/use-legal.ts)

> handles retrieval of legal docs from IPFS service. Available actions include;

- getLegalDoc

### [useModalState](./src/use-modal-state.ts)

> handles rendering and dismissal of modals. Available actions include;

- show
- showAfterLogin
- hide

### [useNetworkState](./src/use-network-state.ts)

> handles checks to ensure that the user is on the appropriate ethereum network required for the app. Available actions
> include;

- checkNetwork

### [useNotifications](./src/use-notifications.ts)

> handles notification related functionalities in the [notifications plugin](../plugins/notifications/README.md).
> Available actions include;

- getMessages
- markMessageAsRead
- hasNewNotifications


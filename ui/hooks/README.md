# Hooks

This package contains all hooks required for proper functioning of the AKASHA Core

## Available Hooks

### [useAnalytics](./src/use-analytics.tsx)

> handles user consent to tracking and analytics functions. Available actions include;

- enableTracking
- acceptConsent
- rejectConsent
- trackEvent

### [useGlobalLogin](./src/use-global-login.ts)

> handles actions triggered right after a user logs in or out of the app.

### [useLogin](./src/use-login.new.ts)

> handles the signing-in of a user

### [useGetLogin](./src/use-login.new.ts)

> handles the retrieval of the current authentication state of a user. If a user 
is logged in, the returned data ({ data }) will be an object containing the id 
and ethAddress of the user. 

### [useGetLoginProfile](./src/use-login.new.ts)

> handles the retrieval of a user's profile information when that user is signed in.

### [useLogout](./src/use-login.new.ts)

> handles the signing-out of a user

### [useLegal](./src/use-legal.ts)

> handles retrieval of legal docs from IPFS service. Available actions include;

- getLegalDoc

### [useNetworkState](./src/use-network-state.ts)

> handles checks to ensure that the user is on the appropriate ethereum network required for the app. 
> Available actions include;

- switchToRequiredNetwork: used for switching to a network our app supports.
- useNetworkState: used for checking if the user's web3 network is supported. The `networkNotSupported` property of the returned `data`
object is a boolean whose value tells whether the network is supported or not.
- useCurrentNetwork: used for checking the current web3 network of the user.
- useRequiredNetwork: used for fetching the required network name.
- useNetworkChangeListener: used for detecting changes when a user switches from one network to another.

### [useNotifications](./src/use-notifications.ts)

> handles notification related functionalities in the [notifications app](../apps/notifications/README.md).
> Available actions include;

- markMessageAsRead
- checkNewNotifications

### [useSaveSettings](./src/use-settings.ts)

> handles the saving of the settings for an app.

### [useGetSettings](./src/use-settings.ts)

> handles the retrieval of the settings for an app.

### [useGetIndexingDID](./src/use-settings.ts)

> handles the retrieval of the indexing DID used by the SDK's GraphQL client.

### [useNsfwToggling](./src/use-nsfw.ts)

> handles the retrieval and saving of user's choice for showing/hiding NSFW content

### [usePendingReflections](./src/use-pending-reflections.ts)

> handles the adding, removing and returning of pending Reflections by first providing a reactive variable parameter to the hook as the initial state of the
pending reflections. The updated pending reflections returned can be used to update/re-render the
components directly without the need to use `useQuery`.

### [useBeams](./src/use-beams.ts)

> handles the retrieval of all the beams published or beams published by a DID (when passed a `did` param).

### [useBeamsByTags](./src/use-beams-by-tags.ts)

> handles the retrieval of all the beams published with a tag (or multiple tags)

### [useMentions](./src/use-mentions.ts)

> handles the retrieval of possible matching users' names that a user can mention

### [useNsfwToggling](./src/use-nsfw.ts)

> handles the getting and setting of the user's choice for showing/hiding nsfw content

### [usePendingReflections](./src/use-pending-reflections.ts)

> makes use of the Apollo Client's reactivity model to allow the adding,
  removing and returning of pending Reflections to a component (i.e. the Beam Page)
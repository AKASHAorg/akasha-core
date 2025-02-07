# Custom Hooks
This section provides in-depth information on the custom hooks used in the Akasha Core.

### useRootComponentProps
Manage and access props received by the root component.
These props may contain the context of the plugins for routing, translation, and extensions.
It also exposes some utility functions which may be used across the World.

For example, the `worldConfig` object can be used to access the configuration info related to the application's World.
The `navigateToModal` method helps to load the matching modal from the modal params.
The `getCorePlugins` method exposes the main plugins used in Core, such as the routing plugin, which is useful for navigation within an application.

:::info
This hook requires that the root component app be wrapped with the accompanying provider.
The Akasha Core hooks package exposes a Higher Order Component called `withProviders` that takes care of this, in addition to other providers.
Alternatively, you can also directly use the `RootComponentPropsProvider` required for the `useRootComponentProps` hook
:::

**Example usage**
```tsx
import { useRootComponentProps, RootComponentPropsProvider } from '@akashaorg/ui-core-hooks';

const Component = () => {
const {
   baseRouteName,
   uiEvents,
   worldConfig,
   getCorePlugins,
   getTranslationPlugin,
   navigateToModal,
   // ...
} = useRootComponentProps();

// get i18n instance from the translation plugin
const i18n = getTranslationPlugin().i18n

// handle navigation using the routing from core plugins
const handleNavigate = () => {
  getCorePlugins().routing.navigateTo({
    appName: 'applicaton namspace',
    getNavigationUrl: () => {
      // ...
    }
  })
}
}

export default <RootComponentPropsProvider><Component/></RootComponentPropsProvider>
```
_________
### useAnalytics
Handle analytics in your applications

> This hook is helpful in managing opt-in analytics functionality in a world.

**Example usage**
```tsx
import { AnalyticsCategories } from '@akashaorg/typings/lib/ui';
import { useAnalytics } from '@akashaorg/ui-core-hooks';

const Component = () => {
const [ analyticsActions ] = useAnalytics();

const subscribed = true;

// handle navigation using the routing from core plugins
const handleTopicSubscription = () => {
  analyticsActions.trackEvent({
    category: AnalyticsCategories.FILTER_SEARCH,
    action: subscribed ? 'Topic Subscribed' : 'Topic Unsubscribed'
  })
}
}
```
_________
### useConnectWallet
Connect to a user's wallet during user profile authentication

> This hook provides seamless way to connect to a user's web3 wallet during authentication (first time or returning user)

**Example usage**
```tsx
import { useConnectWallet } from '@akashaorg/ui-core-hooks',

const Component = () => {
  const connectWalletCall = useConnectWallet();

  useEffect(() => {
    connectWalletCall.connect(); // trigger the connect method when the component mounts
  }, [])
}
```
_________
### useRequiredNetwork
Get the required network details from the SDK.

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `data` - an object containing required network's details such as name and chainId
- `isLoading` - loading state of the request
- `isSuccess` - true, if the request is successfully completed
- `error` - error object from the request, if any

**Example usage**
```tsx
import { useRequiredNetwork } from '@akashaorg/ui-core-hooks',

const Component = () => {

const { data, isLoading, error } = useRequiredNetwork();

const chainId = data.chainId;

if (isLoading) {
  return (
    <div>loading ...</div>
  )
};

if (error) {
  return (
    <div>An error has occured: {error.message}</div>
  )
};

return (
  <div>
    {/** do something with `chainId`*/}
  </div>
)
```
_________
### useNetworkChangeListener
Listen for changes in logged user provider's current network.
It can be used in conjunction with [useRequiredNetwork](#userequirednetwork) to determine when to prompt user to switch back to the correct network.

#### Returned data object
When the hook has successfully run, it returns an array containing:
- `currentNetwork` - an object containing details of provider's current network
- `unsubscribe` - an utility function to unsubscribe from globalChannel

**Example usage**
```tsx
import { useNetworkChangeListener, useRequiredNetwork } from '@akashaorg/ui-core-hooks',

const Component = () => {

const [ changedNetwork, changedNetworkUnsubscribe ] = useNetworkChangeListener();
const requiredNetwork = useRequiredNetwork();

if (requiredNetwork.data.chainId !== changedNetwork.chainId) {
  return <div>
  Hello, please switch back to {requiredNetwork.data.name}
  </div>
}

useEffect(() => {
return () => changedNetworkUnsubscribe(); // unsubscribe from the globalChannel when component unmounts.
}, [ changedNetwork ])

return (
  <div>
    {/** do something with `changedNetwork`*/}
  </div>
)
```
_________
### useLegalDoc
Retrieve legal docs stored on IPFS

#### Required variables
- docName: `string` - the name of doc to be retrieved

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `data` - an object containing fetchd legal doc
- `isLoading` - loading state of the request
- `error` - error object from the request, if any
- `isFetched` - boolean value that checks if the returned data is defined

**Example usage**
```tsx
import { useLegalDoc } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { data, isLoading, error, isFetched } = useLegalDoc();

if (isLoading) return <div>loading ...</div>;

if (error) return <div>An error has occured: {error.message}</div>;

return (
  <div>
  {
    isFetched ? <div>
    {/** do something with the returned `data` */}
    </div>
  }
  </div>
)
}
```
_________
### usePlaformHealthCheck
Check the overall status of the Akasha World Platform and its acssociated services. This hook plays a crucial role in informing the user of any downtime when maintenance mode is triggered or enabled.

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `data` - an object containing the `statusCode` and `success` values of the request.
- `isLoading` - loading state of the request

**Example usage**
```tsx
import { usePlaformHealthCheck } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { data, isLoading} = usePlaformHealthCheck();

if (isLoading) return <div>loading ...</div>;

return (
  <div>
    platform status: { statusCode }
  </div>
)
}
```
_________
### useDismissedCard
Manage information cards displayed in the sidebar or inside the apps which users can dismiss by clicking the close button.

#### Required variables
- id: `string` - unique id of the information card

#### Optional variables
- statusStorage: `IStorage` - type of local storage

#### Returned data object
When the hook has successfully run, it returns an array containing:
- `dismissed` - boolean value indicating whether te card has been dismissed or not
- `dismissCard` - an utility function to dismiss cards

**Example usage**
```tsx
import { useDismissedCard } from '@akashaorg/ui-core-hooks',

const Component = () => {
const profileDID = 'profile DID'
const [ dismissed, dismissCard ] = useDismissedCard('@akashaorg/ui-widget-layout_version-info-card');

return (
  <div>
    {
      !dismissed && <div onClick={dismissCard}>information card</div>
    }
  </div>
)
}
```
_________
### useValidDid
Check the validity of an account's Decentralized IDentity (DID) address using the SDK's services.

#### Required variables
- profileId: `string` - DID of the profile to be checked for validity

#### Optional variables
- enabled: `boolean` - indicate when to run the query

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `validDid` - boolean value indicating whether the passed DID is valid or not
- `isLoading` - loading state of the request
- `isEthAddress` - boolean value indicating whether the valid DID is also a valid ETH Address

**Example usage**
```tsx
import { useValidDid } from '@akashaorg/ui-core-hooks',

const Component = () => {
const profileDID = 'profile DID'
const { validDid, isLoading } = useValidDid(profileDID, true);

if (isLoading) return <div>loading ...</div>;

return (
  <div>
    {/** do something with `validDid` */}
  </div>
)
}
```
_________
### useAccordion
Handle state of Accordion component especially when systematic control is required in a component containing more than one accordion element.

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `activeAccordionId` - id of the active accordion
- `setActiveAccordionId` - useState hook to set the active accordion id
- `handleAccordionClick` - an utility function to handle acordion click

**Example usage**
```tsx
import { useAccordion } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { activeAccordionId, handleAccordionClick } = useAccordion();

return (
  <Accordion
  open={elementId === activeAccordionId}
  handleClick={handleAccordionClick}
  />
)
}
```
_________
### useModalData
Handle data supplied to the modal extension. This hook uses a helper utility method `getModalFromParams` from [useRootComponentProps](#userootcomponentprops). It needs to be called in a modal component so it can have access to the modal params.

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `modalData` - an object containing important information for rendering a modal, such as name, message, title.

**Example usage**
```tsx
import { useModalData } from '@akashaorg/ui-core-hooks',

const BeamRemoveComponent = () => {
const { modalData } = useModalData();

const beamId = modalData('beamId');

return (
  <div>
    {/** do something with beamId*/}
  </div>
)
}
```
_________
### useListenForMutationEvents
Listen for GraphQL mutation events emitted from the SDk's globalChannel.

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `data` - response from GraphQL mutation events' subscription to the globalChannel.

**Example usage**
```tsx
import { useListenForMutationEvents } from '@akashaorg/ui-core-hooks',

const Component = () => {
const mutationEvents = useListenForMutationEvents();

useEffect(() => {
  if (mutationEvents) {
    const {
      messageObj,
      appid,
      success,
      pending
    } = mutationEvents

    // do something with returned data
  }
}, [mutationEvents])
}
```
_________
### useTheme
Check or set user's UI theme preference (Light or Dark theme)

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `theme` - the current theme preference
- `propagateTheme` - an utility function to update the theme preference

**Example usage**
```tsx
import { useTheme } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { theme, propagateTheme } = useTheme();

const handleThemeSwitch = (value: string) => () => {
  propagateTheme(value, true);
};

return (
  <div>
    User's current theme is: {theme}
    <button onClick={handleThemeSwitch('Light Theme')}>
      Set Theme
    </button>
  </div>
)
}
```
_________
### useProfileStats
Get a profile's statistics (number of beams, followers, following, interests) from the SDK profile service.

#### Required variables
- profileId: `string` - id of the profile whose stats is to be read

#### Optional variables
- readCache: `boolean` - indicate whether or not to read value from cache

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `data` - app settings from the SDK
- `loading` - loading state of the request
- `error` - error object from the request, if any

**Example usage**
```tsx
import { useProfileStats } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { data, loading, error } = useProfileStats('some profile id');

if (loading) return <div>loading ...</div>;

if (error) return <div>An error has occured: {error.message}</div>;

return (
  <div>
    {/** do something with `data` */}
  </div>
)
```
_________
### useSaveSettings
Save an application's settings using SDK settings service

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `saveNotificationSettings` - an utility function to save the settings
- `data` - data from the request
- `isLoading` - loading state of the request
- `error` - error object from the request, if any

**Example usage**
```tsx
import { useSaveSettings } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { saveNotificationSettings, data, isLoading, error } = useSaveSettings();

const handleSaveSettings = () => {
  saveNotificationSettings(
    {
      app: "@akashaorg/app-notifications",
      options: {
        // ...
      }
    },
    {
      onComplete: () => {
        // ...
      }
    },
  );
}

if (isLoading) return <div>loading ...</div>;

if (error) return <div>An error has occured: {error.message}</div>;

return (
  <div>
    {/** do something with `data` */}
  </div>
)
}
```
_________
### useGetSettings
Get saved settings for a given application from the SDK

#### Required variables
- app: `string` - name of the application (eg: @akashaorg/app-extensions)

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `data` - app settings from the SDK
- `isLoading` - loading state of the request
- `error` - error object from the request, if any

**Example usage**
```tsx
import { useGetSettings } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { data, isLoading, error } = useGetSettings("@akashaorg/app-notifications");

if (isLoading) return <div>loading ...</div>;

if (error) return <div>An error has occured: {error.message}</div>;

return (
  <div>
    {/** do something with `data` */}
  </div>
)
}
```
_________
### useNsfwToggling
Get and set user's preference for displaying `Not Safe For Work` (NSFW) contents

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `showNsfw` - a boolean value indicating user's preference
- `toggleShowNsfw` - an utility function for toggling user's preference

**Example usage**
```tsx
import { useNsfwToggling } from '@akashaorg/ui-core-hooks',

const Component = () => {
const { showNsfw, toggleShowNsfw } = useNsfwToggling();

const handleToggleNSFW = (value: boolean) => () => {
  toggleShowNsfw(value);
};

return (
  <div>
    Can user currently see nsfw content? {showNsfw}
    <button onClick={handleToggleNSFW(false)}>
    Hide Nsfw
    </button>
  </div>
)
}
```
_________
### useMentions
Retrieve and/or set the mentions associated with a profile

#### Required variables
- authenticatedDID: `string` - id of the authenticated profile

#### Returned data object
When the hook has successfully run, it returns an object containing:
- `setMentionQuery` - a useState hook that sets the provided mention(s).
- `mentions` - a list of mentions object
- `allFollowing` - a list of the profiles, the logged user is following

**Example usage**
```tsx
import { useMentions } from '@akashaorg/ui-core-hooks',

const Component = ({ authenticatedDID }) => {
const { setMentionQuery, mentions } = useMentions(authenticatedDID);

const handleGetMentions = (query: string) => {
  setMentionQuery(query);
};

return (
  <div>
  {/** do something with `mentions` */}
  </div>
)
}
```
---
sidebar_position: 41
sidebar_label: SDK
---

# SDK Overview

The AKASHA SDK is used in every world instance and provides the core functionality to interact with different services and 3rd parties (ex. Metamask, Lit Protocol, Ceramic, ComposeDB, Infura, etc.).

It is essentially divided into two parts:

1. <span style={{color: 'tomato'}}>`Services`</span>: consists of various services related to Ceramic, error logging, GraphQL, cache stashing, database management, app settings, and much more.
2. <span style={{color: 'tomato'}}>`API`</span>: contains various API endpoints related to the global channel, the authentication service and the profile service.

## Project Folder Structure

This section might be helpful if you are interested in understanding how the SDK package is organized from the inside when browsing our Github repo.

In terms of folder structure, the SDK consists of the following modules:

1. <span style={{color: 'tomato'}}>`Authentication`</span>: This module is in charge of signing the user in, managing user's session, and taking care of private message decryption.
2. <span style={{color: 'tomato'}}>`Common`</span>: This module contains miscellaneous methods that encompass web3, DID management, Zod schema validator, IPFS connector, Lit Protocol access configurator, Ceramic session management, Event Bus configuration, error handling, and general configuration for the app.
3. <span style={{color: 'tomato'}}>`DB`</span>: This module contains methods for managing the database such as creating a new DB or getting access to the local DB.
4. <span style={{color: 'tomato'}}>`GQL`</span>: This module is in charge of managing Apollo GraphQL requests and mutations sent from the client. Besides generating an Apollo client instance, it also acts as a middle man that, depending on the context source, will route the GraphQL operation to either the federated GraphQL or the Ceramic node for processing. Moderation is made possible in Akasha World thanks to the federated graph which can add moderation label to a mutation before converting it into a REST request for the Ceramic node.
5. <span style={{color: 'tomato'}}>`Helpers`</span>: This module contains various helper methods for manipulating images or formatting data.
6. <span style={{color: 'tomato'}}>`Logging`</span>: This module is in charge of managing the logging service. There is a create method that you can use to create a logger that is tied with a specific app.
7. <span style={{color: 'tomato'}}>`Posts`</span>: This module contains GraphQL fragments related to the beams and reflections. These fragments are used for generating the hooks that will be used as API endpoints for creating/updating/deleting beams and reflections.
8. <span style={{color: 'tomato'}}>`Profiles`</span>: This module contains GraphQL fragments related to the profile model. It also contains some API endpoints for getting a profile's stats `(getProfileStats)` or for saving media files related to a profile `(saveMediaFile)`.
9. <span style={{color: 'tomato'}}>`Registry`</span>: This module is in charge of managing GraphQL operations related to the extension registry such as mutations to create an app/app release, indexing an app, or queries to get app info.
10. <span style={{color: 'tomato'}}>`Settings`</span>: This module contains get and set methods for saving and getting an application's settings from the browser's IndexedDB storage.
11. <span style={{color: 'tomato'}}>`Stash`</span>: This module contains methods for managing the LRU cache.

## Core Concepts

- dependency injection (inversify)
- RxJS

**_Example usage_**

To instantiate the SDK, you can use one of the methods it exports:

```tsx title="./component-requiring-sdk.tsx"
import getSDK from "@akashaorg/awf-sdk";

const sdk = getSDK();

// use the sdk here
```

or:

```tsx
import { init } from "@akashaorg/awf-sdk";

const sdk = init();
```

The main difference between the two is that `getSDK()` ensures that the sdk object is instantiated only once (singleton) whereas `init()` will instantiate it every time it's called.

## Access Web3 and IPFS services

Web3, IPFS and some DID-related services are available under the common namespace inside services. For example, to open the web3 modal and connect a wallet, you may call the connect method inside web3:

```tsx
import getSDK from "@akashaorg/core-sdk";

getSDK().services.common.web3.connect();
```

## Access Ceramic-related services

Ceramic-related services are available under the ceramic namespace inside services. For example, to attach an authenticated DID to a ceramic node to be able to perform GraphQL mutations, you may call the getComposeClient method inside ceramic:

```tsx
import getSDK from "@akashaorg/core-sdk";

getSDK().services.ceramic.getComposeClient().setDID("an authenticated DID");
```

## Access GraphQL-related services

GraphQL-related services are available under the gql namespace inside services. Below is an example of how to access the current DID used for indexing streams through the SDK:

```tsx
import getSDK from "@akashaorg/core-sdk";

const indexingDID = getSDK().services.gql.indexingDID;
```

## Access Database-related services

Database-related services are available under the db namespace inside services. Below is an example of how to access the current IndexedDB database stored in the browser:

```tsx
import getSDK from "@akashaorg/core-sdk";

getSDK().services.db.getDb();
```

## Access Logging services

Logging service is available under the log namespace inside services. Logging errors associated with a specific app is helpful when things go wrong because it can speed up the debugging process. Below is an example of how to create a logger associated with a specific app and then use it to log an error:

```tsx
import getSDK from "@akashaorg/core-sdk";

getSDK().services.log.create("example-app-name");

if (error) {
  logger.warn("Your error message here");
  // other action
}
```

## API Namespace

All API endpoints related to the authentication, profile, and global channel can be accessed via the API Namespace.

### Authentication

Authentication-related endpoints are available under the `Auth namespace` inside API. For example, to get the current logged in user, you can use:

```tsx
import getSDK from "@akashaorg/core-sdk";

const currentUser = await getSDK().api.auth.getCurrentUser();
// currentUser will be null when the user is not logged in,
// otherwise, it will be an object containing the DID and ethAddress (if any) of the logged in user.
```

### Global Channel

Endpoints related to the SDK's global channel are available under the `globalChannel namespace` inside API. For example, to perform certain action when certain events are emitted, you can access the global channel and subscribe to those events:

```tsx
import getSDK from "@akashaorg/core-sdk";
React.useEffect(() => {
  const subSDK = sdk.api.globalChannel.subscribe({
    next: (eventData: { data: { name: string }; event: APP_EVENTS }) => {
      if (
        eventData.event === APP_EVENTS.INFO_READY &&
        eventData.data.name === integrationName
      ) {
        // perform some actions here
      }
    },
  });
  return () => {
    subSDK.unsubscribe();
  };
}, []);
```

### Profile

Profile-related endpoints are available under the `profile namespace` inside API. For example, to get the stats related to a profile, you will need to call the getProfileStats endpoint under the profile namespace:

```tsx
import getSDK from "@akashaorg/core-sdk";
const res = await getSDK().api.profile.getProfileStats("a profile DID");
```

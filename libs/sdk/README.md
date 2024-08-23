# SDK

The AKASHA SDK is used in every world instance and provides the core functionality to interact with different services and 3rd parties (ex. Metamask, Lit Protocol, Ceramic, ComposeDB, Infura, etc.).

The SDK is essentially divided into two parts: `services` and `api`.

- `services` consists of various services related to Ceramic, error logging, GraphQL, cache stashing, database management, app settings, and much more.

- `api` contains various API endpoints related to the global channel, the authentication service and the profile service.

### Project Folder Structure

This section might be helpful if you are interested in understanding how the SDK package is organized from the inside when browsing our Github repo.

In terms of folder structure, the SDK consists of the following modules:

- Authentication: This module is in charge of signing the user in, managing user's session, and taking care of private message decryption.

- Common: This module contains miscelaneous methods that encompass web3, DID management, Zod schema validator, IPFS connector, Lit Protocol access control configurator, Ceramic session management, Event Bus configuration, error handling, and general configuration for the app.

- DB: This module contains methods for managing the database such as creating a new DB or getting access to the local DB. 

- GQL: This module is in charge of managing Apollo GraphQL requests and mutations sent from the client. Besides generating an Apollo client instance, it also acts as a middle man that, depending on the context source, will route the GraphQL operation to either the federated GraphQL or the Ceramic node for processing. Moderation is made possible in Akasha World thanks to the federated graph which can add moderation label to a mutation before converting it into a REST request for the Ceramic node.

- Helpers: This module contains various helper methods for manipulating images or formatting data. 

- Logging: This module is in charge of managing the logging service. There is a `create` method that you can use to create a logger that is tied with a specific app.

- Posts: This module contains GraphQL fragments related to the beams and reflections. These fragments are used for generating the hooks that will be used as API endpoints for creating/updating/deleting beams and reflections.

- Profiles: This module contains GraphQL fragments related to the profile model. It also contains some API endpoints for getting a profile's stats (`getProfileStats`) or for saving media files related to a profile (`saveMediaFile`).

- Registry: This module is in charge of managing GraphQL operations related to the extension registry such as mutations to create an app/app release, indexing an app, or queries to get app info.

- Settings: This module contains `get` and `set` methods for saving and getting an application's settings from the browser's IndexedDB storage. 

- Stash: This module contains methods for managing the LRU cache. 

### Core concepts

- dependency injection (inversify)
- RxJS

### Usage

To instantiate the SDK, you can use one of the methods it exports:

```typescript
import getSDK from "@akashaorg/core-sdk";

const sdk = getSDK();

// use the sdk here
```

or:

```ts
import { init } from "@akashaorg/core-sdk";

const sdk = init();
```

The main difference between the two is that `getSDK()` ensures that the sdk object is instantiated only once (singleton) whereas `init()` will instantiate it every time it's called.

#### Access web3 and IPFS services

Web3, IPFS and some DID-related services are available under the `common` namespace inside `services`.

For example, to open the web3 modal and connect a wallet, you may call the `connect` method inside `web3`:

```typescript
import getSDK from "@akashaorg/core-sdk";
getSDK().services.common.web3.connect();
;
```

#### Access Ceramic-related services

Ceramic-related services are available under the `ceramic` namespace inside `services`.

For example, to attach an authenticated DID to a ceramic node to be able to perform GraphQL mutations, you may call the `getComposeClient` method inside `ceramic`:

```typescript
import getSDK from "@akashaorg/core-sdk";
getSDK().services.ceramic.getComposeClient().setDID('an authenticated DID');
;
```
#### Access GraphQL-related services

GraphQL-related services are available under the `gql` namespace inside `services`.

Below is an example of how to access the current DID used for indexing streams through the SDK:

```typescript
import getSDK from "@akashaorg/core-sdk";
const indexingDID = getSDK().services.gql.indexingDID;
```
#### Access database-related services

Database-related services are available under the `db` namespace inside `services`.

Below is an example of how to access the current IndexedDB database stored in the browser:

```typescript
import getSDK from "@akashaorg/core-sdk";
getSDK().services.db.getDb();
```
#### Access logging services

Logging service is available under the `log` namespace inside `services`. Logging errors associated with a specific app is helpful when things go wrong because it can speed up the debugging process.

Below is an example of how to create a logger associated with a specific app and then use it to log an error:

```typescript
import getSDK from "@akashaorg/core-sdk";
 getSDK().services.log.create('example-app-name');

  if (error) {
    logger.warn('Your error message here');
    //other action
  }
```

#### The `api` namespace

All API endpoints related to the authentication, profile, and global channel can be accessed via the `api` namespace.

##### Authentication

Authentication-related endpoints are available under the `auth` namespace inside `api`.

For example, to get the current logged in user, you can use: 

```typescript
import getSDK from "@akashaorg/core-sdk";
const currentUser = await getSDK().api.auth.getCurrentUser();
// currentUser will be null when the user is not logged in, otherwise, it will be an object containing the DID and ethAddress (if any) of the logged in user. 
```

##### Global channel

Endpoints related to the SDK's global channel are available under the `globalChannel` namespace inside `api`.

For example, to perform certain action when certain events are emitted, you can access the global channel and subscribe to those events:

```typescript
import getSDK from "@akashaorg/core-sdk";
  React.useEffect(() => {
    const subSDK = sdk.api.globalChannel.subscribe({
      next: (eventData: { data: { name: string }; event: APP_EVENTS }) => {
        if (eventData.event === APP_EVENTS.INFO_READY && eventData.data.name === integrationName) {
          // perform some actions here
        }
      },
    });
    return () => {
      subSDK.unsubscribe();
    };
  }, []);
```

##### Profile

Profile-related endpoints are available under the `profile` namespace inside `api`.

For example, to get the stats related to a profile, you will need to call the `getProfileStats` endpoint under the `profile` namespace:

```typescript
import getSDK from "@akashaorg/core-sdk";
const res = await getSDK().api.profile.getProfileStats('a profile DID');
```

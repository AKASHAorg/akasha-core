# API

Definitive list of APIs available in the AKASHA SDK

## Authentication

The Authentication API provides authentication-related functionalities such as signing in, signing out, and managing user sessions, using Ethereum addresses and decentralized identity (DID) systems. It leverages other services from the SDK like Ceramic, Web3, and GraphQL to manage and verify user credentials and other identity-related operations.

**Constructor**

```ts
constructor(
db: DB,
web3: Web3Connector,
globalChannel: EventBus,
log: Logging,
settings: Settings,
gql: Gql,
lit: Lit,
ceramic: CeramicService,
notificationService: NotificationService,
)
```

- `db (DB)`: Database service used for data storage.
- `web3 (Web3Connector)`: An instance of Web3Connector used to interact with the Web3 provider.
- `globalChannel (EventBus)`: Global event bus for handling app-wide events.
- `log (Logging)`: Logger to log events, warnings, and errors for debugging and monitoring.
- `settings (Settings)`: The configuration/settings for the application.
- `gql (Gql)`: The GraphQL service for querying and mutating data.
- `lit (Lit)`: The Lit service used for data encryption.
- `ceramic (CeramicService)`: The service for managing interactions with the Ceramic network.
- `notificationService (NotificationService)`: The service for handling app-wide notifications.

**Public Properties**

- `waitForAuth`: Indicates the application is waiting for authentication.
- `currentUserKey`: Key used to store the current user data in local storage.
- `encoder`: Instance of TextEncoder used for encoding `strings` into `Uint8Array`.

**Methods**

### checkIfSignedUp

Verifies if an Ethereum address is already registered in the database.

```ts
checkIfSignedUp(ethAddress: EthAddress)
```

**Parameters**

- `ethAddress (EthAddress)`: The Ethereum address to verify.

**Returns**: A Promise that resolves to `true` if the given address is registered, otherwise throws an error.

### signIn

Signs in the user by connecting to a Web3 provider, checking if the address is registered, and setting up a DID session.

```ts
signIn(args: { provider?: EthProviders | Eip1193Provider; checkRegistered: boolean; resumeSignIn?: boolean })
```

**Parameters**

- `args ({ provider?: EthProviders | Eip1193Provider; checkRegistered: boolean; resumeSignIn?: boolean })`:
  - `provider (optional)`: The Web3 provider to use for authentication.
  - `checkRegistered`: A boolean flag to indicate whether to check if the Ethereum address is registered or not.
  - `resumeSignIn (optional)`: A boolean flag indicating whether to resume an existing session.

**Returns**: A Promise that resolves to the authenticated user's data if successful, or `null` if an error occurs.

### getSession

Retrieves the current session details for the authenticated user.

```ts
getSession();
```

**Returns**: A Promise that resolves to the current authenticated user object, or `null` if no user is authenticated.

### getCurrentUser

Fetches the current authenticated user if already set. If none is set, but session exists, prompts sign-in to resume session.

```ts
getCurrentUser();
```

**Returns**: A Promise that resolves to the current authenticated user object, or null if no user is authenticated.

### signOut

Signs the user out by clearing session data, disconnecting from services, and notifying the global event bus.

```ts
signOut();
```

**Returns**: A Promise that resolves to `true` if the sign-out process is successful.

### (WIP) signData

Signs arbitrary data using the user's identity key.

```ts
signData(data: Record<string, unknown> | string | Record<string, unknown>[], base64Format = false)
```

**Parameters**

- `data (Record<string, unknown> | string | Record<string, unknown>[])`: The data to be signed.
- `base64Format (optional)`: A flag to indicate if the signature should be in base64 format.

**Returns**: A Promise that resolves to the signed data.

### signDataWithDID

Signs data using a decentralized identity (DID) key.

```ts
signDataWithDID(data: Record<string, unknown> | string)
```

**Parameters**

- `data (Record<string, unknown> | string)`: The data to be signed.

**Returns**: A Promise that resolves to the signed data.

### prepareIndexedID

Prepares and signs an ID to be indexed for storage.

```ts
prepareIndexedID(id: string)
```

**Parameters**

- `id (string)`: The ID to be indexed.

**Returns**: A Promise that resolves to the signed payload and capability delegation proof.

### validateInvite

Validates an invitation code.

```ts
validateInvite(inviteCode: InviteCode)
```

**Parameters**

- `inviteCode (InviteCode)`: The invitation code to validate.

**Returns**: A Promise that resolves to `true` if the invitation is valid, or throws an error.

### sendMessage

Sends an encrypted message to a recipient.

```ts
sendMessage(to: string, content: unknown)
```

**Parameters**

- `to (string)`: The recipient's DID (Decentralized Identifier).
- `content (unknown)`: The content of the message.

**Returns**: A Promise that resolves to the result of the message sending operation.

### createEncryptedMessage

Encrypts a message for a recipient using the current DID session.

```ts
createEncryptedMessage(to: string, message: string)
```

**Parameters**

- `to (string)`: The recipient's DID.
- `message (string)`: The message content.

**Returns**: A Promise that resolves to the encrypted message.

### (WIP) getToken

Returns a mock token (for testing or simulating purposes).

```ts
getToken();
```

**Returns**: A Promise that returns The mock token.

### _signIn

Handles the internal sign-in logic, including connecting the Ethereum address, checking registration, and initializing the DID session.

```ts
_signIn(args);
```

**Parameters**

- `args`: The arguments for signing in, including provider, check registration flag, and resume sign-in flag.

**Returns**: A Promise that resolves to the authenticated user object or null if an error occurs.

### _getSession

Retrieves the session of the currently authenticated user, prompting sign-in if necessary.

```ts
_getSession();
```

**Returns**: A Promise that resolves to the current authenticated user object or null.

### _connectAddress

Connects to an Ethereum address and returns the address if successful.

```ts
_connectAddress();
```

**Returns**: A Promise that resolves to the Ethereum address if successful, or `null` if connection fails.

### _signOut

Clears session data, disconnects services, and notifies the event bus on sign-out.

```ts
_signOut();
```

**Returns**: A Promise that resolves to `true` if the sign-out process was successful.

---

## GlobalChannel (EventBus)

The EventBus API extends the `ReplaySubject` from RxJS and is designed to provide a mechanism for emitting and receiving events in a reactive manner. It allows subscribers to receive events, including those that were emitted before they subscribed, up to a defined buffer size and/or time window.

:::tip
ReplaySubject is an RxJS subject that allows new subscribers to replay the last emitted values (up to a certain size or within a time-frame), ensuring that they do not miss critical events.
:::

**Constructor**

```ts
constructor(size?: number, time?: number, timeStampProvider?: TimestampProvider)
```

- `size (optional, default 42)`: The maximum number of past events to retain in memory for new subscribers. If this value is not provided, it defaults to 42. When new subscribers subscribe to the EventBus, they will receive up to the provided size of the most recent events that have been emitted.

- `time (optional, default 15000 ms)`: The duration (in milliseconds) that events are retained in the buffer. If this value is not provided, the default retention time is 15 seconds (15000 ms). Events that are older than this duration will not be replayed to new subscribers.

- `timeStampProvider (optional, default Date)`: A provider for generating timestamps for the emitted events. By default, the `JavaScript Date object` is used to generate timestamps. This can be customized to use other timestamp providers if necessary.

**Methods**

Since EventBus extends ReplaySubject, it inherits all the methods available in ReplaySubject

### next

Emits a new event to all subscribers.

```ts
next(value: GlobalEventBusData): void
```

**Parameters**

- `value (type: GlobalEventBusData)`: The event data to emit.

**Returns**: void

### subscribe

Subscribes to receive future events emitted by the EventBus.

```ts
subscribe(observer: Observer<GlobalEventBusData>): Subscription
```

**Parameters**

- `observer (type: Observer<GlobalEventBusData>)`: An object that defines how to handle the emitted events. This could be an object with methods such as next, error, and complete, or a function that handles the emitted events.

**Returns**: A Subscription object that allows the caller to unsubscribe from the event bus when needed.

### unsubscribe

Unsubscribes from the event bus, stopping further event emissions to the subscriber

```ts
unsubscribe(): void
```

**Returns**: void

### complete

Marks the EventBus as complete, signaling that no further events will be emitted.

```ts
complete(): void
```

**Return** : void

### error

Sends an error notification to the subscribers.

```ts
error(err: any): void
```

**Parameters**

- `err (type: any)`: The error object to send to the subscribers.

**Returns**: void

---

## Profiles

The Profile API provides functionalities for interacting with user profiles and performing various profile-related tasks such as retrieving profile statistics and saving media files.

**Constructor**

```ts
constructor(
@inject(TYPES.Gql) gql: Gql,
@inject(TYPES.Auth) auth: AWF_Auth,
@inject(TYPES.IPFS) ipfs: IpfsConnector,
@inject(TYPES.Ceramic) ceramic: CeramicService,
@inject(TYPES.Web3) web3: Web3Connector,
)
```

- `gql (type: Gql)`: The GraphQL service used to fetch profile data from the server.
- `auth (type: AWF_Auth)`: The authentication service responsible for user authentication and session management.
- `ipfs (type: IpfsConnector)`: A service responsible for uploading files to the IPFS network.
- `ceramic (type: CeramicService)`: Service that interacts with Ceramic for decentralized data storage.
- `web3 (type: Web3Connector)`: Service used to to interact with the Web3 provider.

**Methods**

### getProfileStats

Retrieves the profile statistics (followers, following, beams, reflections, and topics) for a user by querying the GraphQL API.

```ts
async getProfileStats(id: string)
```

**Parameters**

- `id (type: string)`: The Decentralized Identifier (DID) of the user whose profile statistics are to be fetched.

**Returns**: A Promise that resolves to an object containing the profile statistics, including:

- `totalFollowing`: Number of users the profile is following.
- `totalFollowers`: Number of users following the profile.
- `totalBeams`: Number of beams made by the profile.
- `totalTopics`: Number of topics the profile has subscribed to.
- `totalReflections`: Number of reflections made by the profile.

### saveMediaFile

Handles uploading a media file to IPFS. The file can either be uploaded directly from content (such as an image file) or retrieved from a URL. The file is resized according to the provided configuration before being uploaded.

```ts
async saveMediaFile(data: { content: File | Buffer | ArrayBuffer | string | any; isUrl?: boolean; name?: string; config?: { quality?: number; maxWidth: number; maxHeight: number; autoRotate?: boolean; mimeType?: string; }; })
```

**Parameters**

- `data (type: object)`: Contains information about the media file to be uploaded.
- `content (type: File | Buffer | ArrayBuffer | string | any)`: The content of the media file, which can be a file object, a buffer, an array buffer, a URL string, or any other data type that can be processed into a file.
- `isUrl (optional, type: boolean)`: If true, the content field is treated as a URL to be downloaded and uploaded. Defaults to false.
- `name (optional, type: string)`: The name of the media file. Must be specified if `isUrl` is false.
- `config (optional, type: object)`:
  - `quality (optional, type: number)`: The quality of the image (relevant for image files).
  - `maxWidth (required, type: number)`: Maximum width to resize the image to.
  - `maxHeight (required, type: number)`: Maximum height to resize the image to.
  - `autoRotate (optional, type: boolean)`: If true, the image will be auto-rotated based on its EXIF data.
  - `mimeType (optional, type: string)`: The MIME type of the file (e.g., 'image/jpeg').

**Returns**: A Promise that resolves to an object containing:

- `CID (type: string)`: The CID (Content Identifier) of the uploaded file on IPFS.
- `size (type: number)`: The size of the uploaded media file.
- `blob (type: Blob)`: The uploaded media file in blob format.

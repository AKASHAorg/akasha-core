# Services

Definitive list of Services available in the AKASHA SDK.

## AppSettings

The AppSettings service is useful in managing the configuration and lifecycle of installed apps in a world. It provides methods for retrieving, installing, uninstalling, and updating the settings of applications. It interacts with a database to store and retrieve app-related data and uses a logger for logging events. It also integrates with an event bus for event-driven communication.

**Constructor**

```ts
constructor(
@inject(TYPES.Log) log: Logging, @inject(TYPES.Db) db: DB, @inject(TYPES.EventBus) globalChannel: EventBus, )
```

- `log (Logging)`: Logger to log events, warnings, and errors for debugging and monitoring.
- `db (DB)`: The database instance for interacting with app configuration data.
- `globalChannel (EventBus)`: Global event bus for handling app-wide events.

**Methods**

### get

Fetches the configuration object for a specific app based on its name. It will throw an error if the app does not exist in the database or if there is an issue with the database query.

```ts
get(appName: IntegrationName): Promise<any>
```

**Parameters**

- `appName (IntegrationName)`: The name of the app whose configuration is being retrieved.

**Returns**: A promise that resolves to the formatted configuration object for the specified app.

### getAll

Fetches the configurations for all installed apps.

```ts
getAll(): Promise<any>
```

**Returns**: A promise that resolves to an array of formatted configuration objects for all installed apps.

### install

Installs a new app or updates the version of an existing app in the system. It will throw an error if the app installation or update fails.

```ts
install(release: { appName: string; releaseId: string; version: string; source: string; applicationType: AkashaAppApplicationType; termsAccepted?: boolean; }): Promise<void>
```

**Parameters**

- `release (object)`: Contains information about the app being installed or updated. The object includes:
- `appName (string)`: The name of the app.
- `releaseId (string)`: The release identifier of the app.
- `version (string)`: The version of the app being installed.
- `source (string)`: The source from which the app was installed.
- `applicationType (AkashaAppApplicationType)`: The type of the application.
- `termsAccepted (boolean, optional)`: A flag indicating whether the user has accepted the terms. Defaults to false if not provided.

**Returns**: A promise that resolves when the app has been successfully installed or updated.

### uninstall

Uninstalls an app by name. It will throw an error if the app does not exist or if the uninstallation process fails

```ts
uninstall(appName: IntegrationName): Promise<void>
```

**Parameters**

- `appName (IntegrationName)`: The name of the app to be uninstalled.

**Returns**: A promise that resolves when the app has been successfully uninstalled.

---

## Ceramic

The Ceramic service handles interaction with the Ceramic network. This includes connecting to Ceramic resources and managing Decentralized Identifiers (DIDs) sessions. Just like with other services and APIs, it integrates with various injected dependencies from other services, such as a database, Web3 provider, event bus, logger, settings etc.

**Constructor**

```ts
constructor(
@inject(TYPES.Db) db: DB,
@inject(TYPES.Web3) web3: Web3Connector,
@inject(TYPES.EventBus) globalChannel: EventBus,
@inject(TYPES.Log) log: Logging,
@inject(TYPES.Settings) settings: Settings,
@inject(TYPES.Config) config: AWF_Config,
)
```

- `db (DB)`: A database to manage data storage and retrieval.
- `web3 (Web3Connector)`: An instance of Web3Connector used to interact with the Web3 provider.
- `globalChannel (EventBus)`: Global event bus for handling app-wide events.
- `log (Logging)`: Logger to log events, warnings, and errors for debugging and monitoring.
- `settings (Settings)`: Application settings used to configure various services and options.
- `config (AWF_Config)`: Configuration object that provides additional configuration values such as endpoint URLs.

**Methods**

### getAccountID

Retrieves the current Ethereum address from the Web3 provider and creates an AccountId object using the Ethereum address and chain ID. If no Ethereum address is connected, it throws an error.

```ts
async getAccountID(): Promise<AccountId>
```

**Returns**: A Promise that resolves to an `AccountId`.

### connect

Authenticates the user using their Ethereum account, creates a DIDSession object, and sets it on the ComposeClient instance. It uses the Web3 provider to fetch the Ethereum address and chain ID, then establishes a session that lasts for one week. If no address or Web3 provider is found, it throws an error.

```ts
async connect(): Promise<DIDSession>
```

**Returns**: A Promise that resolves to a `DIDSession`.

### connectWithKey

Authenticates the user with the provided private key, creates a new DID object using the` Ed25519 provider`, and sets the DID on the `ComposeClient` instance. It ensures the private key is properly validated through the `validate` decorator.

```ts
@validate(z.string().length(64))
async connectWithKey(key: string): Promise<DID>
```

**Parameters**

- `key (string)`: A `64-character hexadecimal` private key used to authenticate the user.

**Returns**: A Promise that resolves to a DID object.

### getComposeClient

Returns the `ComposeClient` instance associated with the current session, allowing the user to interact with Ceramic resources.

```ts
getComposeClient(): ComposeClient
```

**Returns**: The ComposeClient instance.

### hasSession

Checks if a DID session exists for the current Ethereum account ID by querying the session storage.

```ts
async hasSession(): Promise<boolean>
```

**Returns**: A Promise that resolves to a boolean indicating whether a DID session exists for the current Ethereum account.

### geResourcesHash

Generates a hash from the concatenated list of resources and returns the hash along with the resources.

```ts
async geResourcesHash(): Promise<{ hash: string, resources: string[] }>
```

**Returns**: A Promise that resolves to an object containing:

- `hash`: A `SHA256 hash` of the concatenated resources.
- `resources`: An array of resources currently associated with the ComposeClient.

### setCeramicEndpoint

Sets the new Ceramic endpoint URL and disconnects the current session, resetting the connection to the new endpoint.

```ts
async setCeramicEndpoint(endPoint: string): Promise<void>
```

**Parameters**
`endPoint (string)`: The new Ceramic API endpoint URL to set.

**Returns**: A Promise that resolves to void.

### getOptions

Returns the configuration options, including the Ceramic API endpoint URL.

```ts
getOptions(): { endpointURL: string }
```

**Returns**: An object with the endpoint URL for Ceramic.

### disconnect

Disconnects the current DID session by removing the session associated with the current account and resetting the ComposeClient. If there is an active DID session, it will be cleared, and a new ComposeClient will be initialized with the current endpoint URL.

```ts
async disconnect(): Promise<void>
```

**Returns**: A Promise that resolves to void.

---

## DB

The DB service is useful in managing a local database instance. It provides methods for creating and retrieving a database instance, accessing collections, and ensuring that the database is open before performing any operations. The database instance is encapsulated in a `DbWrapper` object.

**Constructor**

```ts
constructor();
```

The constructor initializes the class with two properties: `_dbName`, which stores the name of the database, and `_db`, which will hold an instance of the DbWrapper. Initially, `_db` is set to undefined, and the `_dbName` is set to an empty string.

**Methods**

### create

Creates a new `DbWrapper` instance, which represents the local database. It also assigns the name parameter to the `_dbName` property. This method is used to initialize the database before it can be used. The `validate decorator` ensures that the name parameter is a string.

```ts
@validate(z.string())
create(name: string): DbWrapper
```

**Parameters**
`name (string)`: The name of the database to be created.

**Returns**: An instance of `DbWrapper` after initializing it with the provided name.

### getDb

Returns the current database instance after calling the private method `_ensureDbOpened` to verify that the database has been opened. If the database is not yet opened, it will throw an error indicating that the database needs to be created first.

```ts
async getDb(): Promise<DbWrapper>
```

**Returns**: A Promise that resolves to an instance of `DbWrapper`.

### getCollections

Provides access to specific collections within the database. If the database has not been created, it may return undefined values for the collections.

```ts
getCollections(): { installedExtensions?: any, settings?: any }
```

**Returns**: An object containing `installedExtensions` and `settings` collections from the `_db` instance.

---

## GraphQL

The GraphQL service is in charge of managing Apollo GraphQL requests and mutations sent from the client. Besides generating an Apollo client instance, it also acts as a middle man that, depending on the context source, will route the GraphQL operation to either the federated GraphQL or the Ceramic node for processing. It also manages cache resets, viewer identification, and mutation notifications.

**Constructor**

```ts
public constructor(
  @inject(TYPES.Log) log: Logging,
  @inject(TYPES.Ceramic) ceramic: CeramicService,
  @inject(TYPES.EventBus) globalChannel: EventBus,
  @inject(TYPES.Config) config: AWF_Config,
)
```

- `log (Logging)`: Logger to log events, warnings, and errors for debugging and monitoring.
- `ceramic (CeramicService)`: The service for managing interactions with the Ceramic network.
- `globalChannel (EventBus)`: Global event bus for handling app-wide events.
- `config (AWF_Config)`: A configuration service used to retrieve application configuration options.

**Properties**

- `queryClient (type: ApolloClient)`: Provides access to the Apollo client, which can be used to send queries and mutations to the GraphQL API. Returns the Apollo client instance `this.apolloClient`.

- `contextSources (type: { default: symbol; composeDB: symbol })`: Provides context source symbols for operations within the GraphQL API. Returns the `_contextSources` object, which contains symbols for different context sources (default and composeDB).

- `labelTypes (type: LabelTypes)`: Provides access to the available label types (used for specific operations within the API). Returns the `LabelTypes` object.

- `indexingDID (type: string)`: Provides the DID used for indexing purposes. Returns the indexing DID from the configuration `this._config.getOption('indexing_did')`.

- `mutationNotificationConfig (type: Object)`: Provides configuration for mutation notifications. Returns an object with a notification option name `EmitNotification`.

- `client (type: Sdk)`: Provides access to the SDK used for interacting with the GraphQL API. Returns the client instance `this._client`.

**Methods**

### requester

Sends a GraphQL operation (query or mutation) to the Apollo client and handles errors. For mutations, it generates a UUID, publishes mutation notifications via the global event bus, stores errors in sessionStorage, and throws errors if present. For queries, it simply sends the request and returns the result data. It also handles the context headers by including the viewerID if available.

```ts
public requester = async <R, V>(
doc: DocumentNode | string,
vars?: V,
options?: Record<string, any>,
): Promise<R>
```

**Parameters**

- `doc (DocumentNode | string)`: The GraphQL query or mutation document. It can either be a string (which will be converted to a DocumentNode) or an already parsed DocumentNode.
- `vars (V | undefined)`: Optional variables to be passed with the query or mutation.
- `options (Record<string, any> | undefined)`: Optional context or headers for the request.

**Returns**: A Promise that resolves to the result data of the GraphQL operation.

### resetCache

Resets the Apollo client cache by calling `this._apolloCache.reset()`.

```ts
async resetCache(): Promise<void>
```

**Returns**: A Promise that resolves once the cache has been reset.

### setContextViewerID

Sets the viewerID and resets the Apollo client cache by calling `this.resetCache()`.

```ts
async setContextViewerID(id: string): Promise<void>
```

**Parameters**

- `id (string)`: The viewer's ID to be set.

**Returns**: A Promise that resolves once the viewer ID is set.

### consumeMutationNotificationObject

Retrieves the mutation notification from sessionStorage using the provided `uuid`, removes the notification from sessionStorage, and returns the parsed data. If parsing fails, it logs a warning and returns `undefined`.

```ts
@validate(z.string().min(20))
consumeMutationNotificationObject(uuid: string): any
```

**Parameters**

- `uuid (string)`: The UUID of the mutation notification to be consumed.

**Returns**: The parsed notification object (or `undefined` if the object could not be found or parsed).

---

## IPFS

The IPFS service facilitates interactions with the InterPlanetary File System (IPFS) via the Web3 Storage API. It handles file upload and retrieval, and the construction of IPFS-related links. It uses a client `w3upClient` to interact with IPFS storage, leveraging Ceramic as a decentralized storage solution for the session management.

**Constructor**

```ts
constructor(
@inject(TYPES.Log) log: Logging,
@inject(TYPES.Ceramic) ceramic: CeramicService,
@inject(TYPES.Config) config: AWF_Config,
)
```

- `log`: Logger to log events, warnings, and errors for debugging and monitoring.
- `ceramic`: The service for managing interactions with the Ceramic network..
- `config`: Configuration options for various settings like IPFS gateway URLs.

**Methods**

### getSettings

Returns the current settings for the IPFS gateways.

```ts
getSettings(): { pathGateway: string, originGateway: string, fallbackGateway: string }
```

**Returns**: An object containing

- `pathGateway`: string
- `originGateway`: string,
- `fallbackGateway`: string

### uploadFile

Uploads a file to IPFS using the w3upClient. If the client does not exist, it is created. It checks if a storage space exists for the client and retrieves a storage proof if needed. Once the space is set, the file is uploaded.

```ts
async uploadFile(file: Blob): Promise<string>
```

**Parameters**

- `file`: The Blob object representing the file to be uploaded.

**Returns**: A Promise that resolves with the `IPFS CID (Content Identifier)` of the uploaded file.

### catDocument

Retrieves the content of a document from IPFS by its CID or URL. It fetches the document and either returns the response as a plain text or a JSON object based on the `jsonResponse` flag.

```ts
async catDocument<T>(docHash: string | CID, jsonResponse?: boolean): Promise<T>
```

**Parameters**

- `docHash`: The IPFS CID or URL of the document.
- `jsonResponse (optional)`: A boolean flag to specify whether the response should be parsed as JSON.

**Returns**: A Promise that resolves with the document content in either text or JSON format.

### getLegalDoc

Fetches a predefined legal document (terms of use, privacy policy etc). The document's IPFS CID is retrieved from a source and then fetched using `catDocument` method.

```ts
async getLegalDoc(doc: LEGAL_DOCS): Promise<never>
```

**Parameters**

- `doc`: A value specifying which legal document to retrieve.

**Returns**: A Promise that resolves with the legal document's content.

### validateCid

Validates a CID or IPFS URL. It parses the CID and checks whether the input is a valid CID or a URL.

```ts
async validateCid(hash: string | CID): Promise<{ cid: CID } | { link: string }>
```

**Parameters**

- `hash`: A string (IPFS URL or CID) to be validated.

**Returns**: A Promise that returns either a cid or a link depending on the input type.

### buildOriginLink

Constructs an IPFS link to the original resource (using the IPFS origin gateway).

```ts
async buildOriginLink(hash: string | CID): Promise<string>
```

**Parameters**

- hash: The IPFS CID or URL.

**Returns**: A Promise that returns the constructed IPFS origin link.

### buildFallBackLink

Constructs a fallback IPFS link for a resource, in case the origin gateway is unavailable.

```ts
async buildFallBackLink(hash: string | CID): Promise<string>
```

**Parameters**

- `hash`: The IPFS CID or URL.

**Returns**: A Promise that returns the constructed fallback IPFS link.

### buildPathLink

Constructs an IPFS path link for a resource, utilizing the path gateway.

```ts
async buildPathLink(hash: string | CID): Promise<string>
```

**Parameters**

- `hash`: The IPFS CID or URL.

**Returns**: A Promise that returns the constructed IPFS path link.

### buildIpfsLinks

Constructs all three types of IPFS links (origin, fallback, and path) for a given hash.

```ts
async buildIpfsLinks(hash: string | CID): Promise<{ originLink: string, fallbackLink: string, pathLink: string }>
```

**Parameters**

- `hash`: The IPFS CID or URL.

**Returns**: A Promise that returns an object containing the three types of IPFS links.

### transformBase16HashToV1

Transforms a base16 encoded hash to a V1 CID.

```ts
async transformBase16HashToV1(hash: string): Promise<CID>
```

**Parameters**

- `hash`: A string representing the base16 encoded hash.

**Returns**: A Promise that returns the transformed V1 CID.

### addrToUri

Converts various address formats to their corresponding URI. It supports `/ipfs/` paths, `ipfs://` links, multi-addresses, and standard URLs.

```ts
async addrToUri(addr: string): Promise<string>
```

**Parameters**

- `addr`: A string representing an address.

**Returns**: A Promise that returns the URI corresponding to the address.

### multiAddrToUri

Converts a list of multi-addresses to URIs. It can process both a single address and an array of addresses.

```ts
async multiAddrToUri(addrList: string | string[]): Promise<string[] | string>
```

**Parameters**

- `addrList`: A single address or an array of addresses to convert.

**Returns**: A Promise that returns either a single URI or an array of URIs, depending on the input.

---

## Lit

The Lit service utilizes Lit Protocol for secure encryption and decryption of data using Ethereum-based wallets. It provides methods to connect to the Lit Node, create sessions for cryptographic operations, and encrypt/decrypt text data with access control conditions. It uses Web3 for wallet integration and works with Ethereum network addresses.

**Constructor**

```ts
constructor(
@inject(TYPES.Db) db: DB,
@inject(TYPES.Web3) web3: Web3Connector,
@inject(TYPES.EventBus) globalChannel: EventBus,
@inject(TYPES.Log) log: Logging,
@inject(TYPES.Settings) settings: Settings,
@inject(TYPES.Gql) gql: Gql,
)
```

- `db`: The database service for storing and retrieving data.
- `web3`: An instance of Web3Connector used to interact with the Web3 provider.
- `globalChannel`: Global event bus for handling app-wide events.
- `log`: Logger to log events, warnings, and errors for debugging and monitoring.
- `settings`: Configuration settings to be used.
- `gql`: The GraphQL service for querying and mutating data.

**Methods**

### connect

Establishes a connection to the `Lit Node client`. If the client is not already initialized, it creates a new instance of `LitNodeClient` with the specified network and debug settings.

```ts
async connect(): Promise<void>
```

`Returns`: A Promise that resolves once the connection to the `Lit Node client` is successfully established.

### createSession

Creates a new cryptographic session by obtaining session signatures from the `Lit Node client`. The session will be valid for 24 hours, and a callback `authNeededCallback` is used to authenticate the session request via Ethereum wallet signatures. It will throw an error if the `Lit Node client` or the waller is not connected.

```ts
async createSession(): Promise<SessionSigsMap | undefined>
```

**Returns**: A Promise that resolves with the session signatures or `undefined` if the session creation fails.

### encryptText

Encrypts a provided plain text string using Lit Protocol's encryption mechanisms. The text is encrypted based on access control conditions tied to the Ethereum address of the user. It throws an error if the `Lit Node client` or no Ethereum address is connected.

```ts
async encryptText(text: string): Promise<{ ciphertext: string, dataToEncryptHash: string }>
```

**Parameters**

- `text`: The plain text string to be encrypted.

**Returns**: A Promise that resolves with an object containing:

- `ciphertext`: The encrypted text.
- `dataToEncryptHash`: A hash of the data to be encrypted.

### decryptText

Decrypts a previously encrypted text string. The decryption process is based on the session signatures and access control conditions tied to the Ethereum address of the user.

```ts
async decryptText(ciphertext: string, dataToEncryptHash: string): Promise<{ data: string }>
```

**Parameters**

- `ciphertext`: The encrypted text that needs to be decrypted.
- `dataToEncryptHash`: The hash of the data that was originally encrypted.

**Returns**: A Promise that resolves with the decrypted data (plain text).

### disconnect

Disconnects from the `Lit Node client` and clears the client instance `litNodeClient`.

```ts
async disconnect(): Promise<void>
```

**Returns**: A Promise that resolves once the disconnection is complete.

---

## Logging

The Logging service is responsible for configuring and managing logging functionality using the `pino logging library`. It provides a method to create child loggers that can be used in different modules or namespaces, facilitating better organization and filtering of log messages based on namespaces. The logger’s level is configurable via the `AWF_Config` service, allowing flexibility in logging verbosity.

**Constructor**

```ts
constructor(@inject(TYPES.Config) config: AWF_Config)
```

- `config`: An instance of `AWF_Config` that provides configuration options for the logger, specifically the `log_level`. The `log_level` determines the verbosity of logs (e.g., info, debug, error, etc.).

**Methods**

### create

Creates a child logger instance from the main logger `_appLogger`. The child logger can have its own logging messages associated with a specific namespace or module. This helps in categorizing logs for different parts of the application, making it easier to filter or search logs by module. The level of the logger is configured based on the `log_level` provided in the `AWF_Config`.

```ts
create(nameSpace?: string): ILogger
```

**Parameters**

- `nameSpace (optional)`: A string representing the namespace or module name. This is used to create a child logger that can be associated with a specific part of the application. The namespace can be any valid string (e.g., auth, db, api). If not provided, the logger is created without a namespace.

**Returns**:

- `ILogger`: A child logger instance created using the main \_appLogger. This logger inherits the configuration of the main logger and can be used for logging messages in a specific module or part of the application. The level of the logger is inherited from the main logger, and the logger will have the module field set to the provided namespace.

---

## Misc

The Misc service provides various utility functions related to API status, DID resolution, and account information retrieval. This class allows interaction with APIs, resolving decentralized identifiers (DIDs), and parsing account-related information based on serialized identifiers.

**Constructor**

```ts
constructor(config: AWF_Config)
```

- `config (AWF_Config)`: A configuration object that provides access to various configuration options like the `api_status_path` and `graphql_uri`.

---

## Notifications

The Notification service provides functionality to manage and interact with notifications. It supports initializing a notification client, enabling notifications, managing user settings, listening for incoming notifications, and updating notification settings. The service uses the `PushProtocol` to send and receive notifications and requires a Web3 provider for initialization.

**Constructor**

```ts
constructor(
  @inject(TYPES.Log) logFactory: Logging,
  @inject(TYPES.EventBus) globalChannel: EventBus,
  @inject(TYPES.Config) config: AWF_Config,
  @inject(TYPES.Web3) web3: Web3Connector,
)
```

- `logFactory`: Logger to log events, warnings, and errors for debugging and monitoring.
- `globalChannel`: Global event bus for handling app-wide events.
- `config`: An instance of AWF_Config that holds configuration settings for the application.
- `web3`: An instance of Web3Connector used to interact with the Web3 provider.

**Methods**

### initialize

Initializes the push client. If the mode is `read-only`, it doesn't prompt the user for a signature. If the mode is `writable`, it prompts the user for a signature to enable notifications and interaction with the notifications service.

```ts
initialize(options: InitializeOptions = { readonly: true }): Promise<void>
```

**Parameters**

- `options (optional)`: An object containing the initialization options. The readonly flag (default true) determines whether the client will be initialized in read-only mode or in writable mode.

**Returns**: A Promise that resolves when the push client is successfully initialized.

### checkIfNotificationsEnabled

Checks if notifications are enabled by verifying whether the push client is in writable mode.

```ts
checkIfNotificationsEnabled(): boolean
```

**Returns**: A boolean value indicating if notifications are enabled and the push client is in writable mode.

### listenToNotificationEvents

Starts listening to incoming notifications. The service listens to a stream of notifications and displays them as browser notifications if permission is granted. Users can interact with notifications through clicks.

```ts
listenToNotificationEvents(): Promise<void>
```

**Returns**: A Promise that resolves when the notification stream is successfully initialized and starts listening.

### stopListeningToNotificationEvents

Stops listening to notification events and disconnects the notification stream.

```ts
stopListeningToNotificationEvents(): Promise<void>
```

**Returns**: A Promise that resolves when the notification stream is successfully stopped.

### disconnect

Disconnects the notification service and sets the `_pushClient` to undefined, stopping all related processes.

```ts
disconnect(): Promise<void>
```

**Returns**: A Promise that resolves when the service is successfully disconnected.

### getSettingsOfChannel

Fetches the settings of the notification channel. This method must be called after initializing the client in read-only mode.

```ts
getSettingsOfChannel(): Promise<ChannelSettings[]>
```

**Returns**: A Promise that resolves with an array of settings for the notification channel.

### getSettingsOfUser

Fetches the user-specific settings for the notification channel. It must be called after initializing the client in read-only mode.

```ts
getSettingsOfUser(): Promise<UserSettingType[] | null>
```

**Returns**: A Promise that resolves with an array of user settings or null if no user settings are available.

### setSettings

Updates the user's notification settings by subscribing to new preferences. The `notificationsWriteClient` must be initialized before calling this method.

```ts
setSettings(newSettings: UserSetting[]): Promise<boolean>
```

**Parameters**

- `newSettings`: An array of user settings to update. The settings must be validated against the channel's available settings.

**Returns**: A Promise that resolves with `true` if the settings were successfully updated, otherwise `false`.

### getNotifications

Fetches notifications with pagination and optional filtering (by channel options or app indexes). It retrieves notifications from the PushProtocol service and parses them locally.

```ts
getNotifications(page: number = 1, limit: number = 30, channelOptionIndexes: ChannelOptionIndex[] = [], resetLatestSeenState = true): Promise<PushOrgNotification[]>
```

**Parameters**

- `page`: The page number of the notifications to fetch (defaults to 1).
- `limit`: The number of notifications to fetch per page (defaults to 30).
- `channelOptionIndexes`: An optional array of channel option indexes to filter notifications.
- `resetLatestSeenState`: If true, the latest notification ID will be updated to track the most recently fetched notification.

**Returns**: A Promise that resolves with an array of filtered notifications.

### enableBrowserNotifications

Requests the user's permission to display browser notifications. This method must be called in environments that support browser notifications.

```ts
enableBrowserNotifications(): Promise<boolean>
```

**Returns**: A Promise that resolves with `true` if the browser notification permission is granted, otherwise `false`.

### parseNotificationData

Processes a notification to add parsed metadata, and determines if it is unread based on the latest stored notification ID.

```ts
parseNotificationData(notification: PushOrgNotification, latestStoredNotificationID: number): PushOrgNotification
```

**Parameters**

- `notification`: The notification object to parse.
- `latestStoredNotificationID`: The ID of the latest stored notification to check if the current notification is unread.

**Returns**:

- `PushOrgNotification`: The enriched notification object, including parsed metadata and unread status.

### parseMetaData

Parses the metadata of a notification, extracting the channel index and gracefully handling potential parsing errors.

```ts
parseMetaData(metaData: AdditionalMetadata): NotificationParsedMetaData
```

**Parameters**

- `metaData`: The metadata object to parse, which includes type and data fields.

**Returns**:

- `NotificationParsedMetaData`: A structured object containing parsed metadata, including the channelIndex and data.

---

## Settings

The Settings service provides methods for interacting with the settings stored in a database. It supports fetching, modifying, and removing settings for various services. It depends on the `Db` service to access and manipulate the settings data.

**Constructor**

```ts
constructor(@inject(TYPES.Db) private _db: DB)
```

- `@inject(TYPES.Db) private _db: DB`: The database instance to interact with.

**Methods**

### get

Fetches the settings for a specified service. It will throw an error if the database query fails or the service does not exist.

```ts
get(service: string): Promise<any>
```

**Parameters**

- `service (string)`: The name of the service whose settings are being fetched.

**Returns**: A promise that resolves to the formatted settings object for the specified service.

### set

Sets or updates the settings for a specified service. It will throw an error if the input parameters are invalid or if there an issue encountered while saving the settings.

```ts
set(service: string, options: [[string, string | number | boolean]]): Promise<{ data: string[] }>
```

**Parameters**

- `service (string)`: The name of the service for which settings are being set.
- `options (Array of tuples)`: An array of option pairs, where each pair contains:
  - The option name (string).
  - The option value, which can be a string, number, or boolean.

**Returns**: A promise that resolves to an object containing the data array, which holds the result of the save operation.

### remove

Removes the settings for the specified service. It will throw an error if the database query fails or the service cannot be found.

```ts
remove(serviceName: string): Promise<void>
```

**Parameters**

- `serviceName (string)`: The name of the service whose settings should be removed.

**Returns**: A promise that resolves when the settings have been successfully removed.

---

## Stash

The Stash service helps in managing cache storage, specifically aimed at UI-related data. The cache is implemented using the `QuickLRU` class, which offers a least-recently-used (LRU) caching mechanism, with configurable size limits and expiration times (defaults to a maximum size of 999 entries and an expiration time of 5 minutes - 300,000 milliseconds). It provides methods for creating custom cache instances, accessing a default UI cache, generating cache keys based on input objects and computing unique cache keys.

**Constructor**

```ts
constructor();
```

---

## Web3

The Web3 service provides a way to interact with a Web3 wallet provider via `Web3Modal`. It is useful in managing the connection between a Web3 application and various Ethereum-based wallets, signing messages, switching networks, retrieving the wallet address, and subscribing to provider and account changes.

**Constructor**

```ts
constructor(logFactory: Logging, globalChannel: EventBus, config: AWF_Config)
```

- `logFactory (Logging)`: Logger to log events, warnings, and errors for debugging and monitoring.
- `globalChannel (EventBus)`: Global event bus for handling app-wide events..
- `config (AWF_Config)`: Configuration object for accessing various configuration options.

**Methods**

### connect

Attempts to establish a connection to a Web3 wallet using Web3Modal. If already connected, it immediately returns the current connection state.

```ts
connect(): Promise<{ connected: boolean; unsubscribe?: () => void }>
```

**Returns**: A promise that resolves to an object containing:

- `connected (boolean)`: Whether the wallet is successfully connected.
- `unsubscribe (function, optional)`: An optional function that can be used to unsubscribe from provider changes.

### setConnectionFeatures

This method allows setting the order of connection methods for Web3Modal. It configures which connection options are presented to the user.

```ts
setConnectionFeatures(connectionFeatures: ConnectMethod[] = ['wallet'])
```

**Parameters**

- `connectionFeatures (ConnectMethod[])`: An array specifying the order of connection methods to display in Web3Modal. Defaults to ['wallet'].

### updateModalOptions

Updates the options of the Web3Modal instance, allowing one to modify the configuration (such as theme or privacy policy URLs).

```ts
updateModalOptions(config: Partial<OptionsControllerState>)
```

**Parameters**

- `config (Partial<OptionsControllerState>)`: An object containing the options to update.

### setModalInstance

Sets a custom Web3Modal instance for the Web3Connector.

```ts
setModalInstance(w3modal: AppKit)
```

**Parameters**

- `w3modal (AppKit)`: The Web3Modal instance to be set.

### getCurrentTheme

Returns the current theme of the Web3Modal instance (either `light` or `dark`).

```ts
getCurrentTheme(): string
```

**Returns**: A string representing the current theme.

### toggleDarkTheme

Toggles the Web3Modal theme between `light` and `dark` modes.

```ts
toggleDarkTheme(enable?: boolean)
```

**Parameters**

- `enable (boolean, optional)`: If true, forces the dark theme to be enabled.

### disconnect

Disconnects the Web3 provider and resets the Web3 instance and provider type to `null`.

```ts
disconnect(): Promise<void>
```

**Returns**: A promise that resolves when the disconnection from Web3 provider is complete.

### signMessage

Signs a human-readable message using the current wallet provider. It uses `personal_sign` for message signing.

```ts
signMessage(message: string)
```

**Parameters**

- `message (string)`: The message to be signed.

**Returns**: A promise that resolves to the signed message.

### lookupAddress

Resolves an Ethereum address to an ENS name if available.

```ts
lookupAddress(address: string): Promise<{ ens: string | null }>
```

**Parameters**

- `address (string)`: The Ethereum address to resolve.

**Returns**: A promise that resolves to an object containing:

- `ens (string | null)`: The ENS name if found, or `null` if no ENS name exists for the address.

### getRequiredNetwork

Returns the network configuration for the required Ethereum network (currently set to `sepolia`).

```ts
getRequiredNetwork();
```

**Returns**: The network configuration as an object with name and chainId.

### switchToRequiredNetwork

Switches the Web3 provider to the required Ethereum network (currently set to `sepolia`).

```ts
switchToRequiredNetwork();
```

**Returns**: A promise that resolves when the network switch is successful.

### checkCurrentNetwork

Checks if the current Web3 provider is connected to the required network. Throws an error if not connected to the required network.

```ts
checkCurrentNetwork();
```

**Returns**: A promise that resolves if the network matches.

# @akashaproject/sdk-db

## `Description`
This package exports the [DBModule](./src/index.ts) class which contains public methods:

> - **availableServices**

and protected methods:

> - **init**
> - **_name**
> - **_registerServices**

It also exports, by default, the [registerModule](./src/index.ts) which returns an instance of the DBModule.

## `Available services`
The [dbService](./src/db.service.ts) exposes:

> - **getDB**

The [settingsAttachmentService](./src/settings.attachment.service.ts) exposes:

> - **get**
> - **put**
> - **deleteSettings**

## `Install`
``` shell script
npm install --save @akashaproject/sdk-db
```

## `Usage`

```
const registerDBModule = require('@akashaproject/sdk-db');
```

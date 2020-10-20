# @akashaproject/sdk-core

## `Description`
This package exports the [CoreModule](./src/index.ts) class which contains public methods:

> - **availableServices**

and protected methods:

> - **init**
> - **_name**
> - **_registerServices**

It also exports, by default, the [bootstrapFactory](./src/index.ts) which returns an instance of Dependency Injection container.

## `Available services`
The [settingsService](./src/settings.service.ts) exposes:

> - **getSettings**
> - **setSettings**
> - **setServiceSettings**

## `Install`
``` shell script
npm install --save @akashaproject/sdk-core
```

## `Usage`

```
const coreModule = require('@akashaproject/sdk-core');
```

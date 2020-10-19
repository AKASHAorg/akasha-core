# @akashaproject/sdk-profiles

## `Description`
This package exports the [ProfileModule](./src/index.ts) class which contains public methods:

> - **availableServices**

and protected methods:

> - **init**
> - **_name**
> - **_registerServices**

It also exports, by default, the [registerModule](./src/index.ts) which returns an instance of the ProfileModule.

## `Available services`
The [profileStoreService](./src/profile.store.service.ts) exposes:

> - **registerSchema**
> - **store**
> - **getProfile**

## `Install`
``` shell script
npm install --save @akashaproject/sdk-profiles
```

## `Usage`

```
const registerProfileModule = require('@akashaproject/sdk-profiles');
```

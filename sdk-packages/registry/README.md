# @akashaproject/sdk-registry

## `Description`
This package exports the [RegistryModule](./src/index.ts) class which contains public methods:

> - **init**
> - **availableServices**

and protected methods:
> - **_name**
> - **_registerServices**

It also exports, by default, the [registerModule](./src/index.ts) which returns an instance of the RegistryModule.

## `Available services`
The [ensService](./src/ens.service.ts) exposes:

> - **getContracts**
> - **claimName**
> - **registerName**
> - **resolveAddress**
> - **resolveName**
> - **isAvailable**

## `Install`
``` shell script
npm install --save @akashaproject/sdk-registry
```

## `Usage`

```
const registerRegistryModule = require('@akashaproject/sdk-registry');
```

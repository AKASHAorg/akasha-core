# @akashaproject/sdk-common

## `Description`
This package exports the [CommonsModule](./src/index.ts) class which contains public methods:

> - **init**
> - **availableServices**

and protected methods:

> - **_name**
> - **_registerServices**

It also exports, by default, the [registerModule](./src/index.ts) which returns an instance of the CommonsModule.

## `Available services`
The [cacheService](./src/cache.service.ts) exposes:

> - **getStash**

The [ipfsService](./src/ipfs.service.ts) exposes:

> - **getInstance**
> - **getUtils**
> - **upload**

The [validatorService](./src/validator.service.ts) exposes;

> - **getValidator**

The [web3UtilsService](./src/web3-utils.service.ts) exposes:

> - **getUtils**

The [web3Service](./src/web3.service.ts) exposes:

> - **regen**
> - **destroy**
> - **wallet**
> - **web3**
> - **getWebInstance**
> - **getContractFactory**

## `Install`
``` shell script
npm install --save @akashaproject/sdk-common
```

## `Usage`

```
const registerCommonModule = require('@akashaproject/sdk-common');
```

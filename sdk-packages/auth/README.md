# @akashaproject/sdk-auth

## `Description`
This package exports the [AuthModule](./src/index.ts) class which contains public methods:

> - **init**
> - **availableServices**

and protected methods:

> - **_name**
> - **_registerServices**

It also exports, by default, the [registerModule](./src/index.ts) which returns an instance of the AuthModule.

## `Available services`
The [authService](./src/auth.service.ts) exposes:

> - **getJWT**
> - **signIn**

## `Install`
``` shell script
npm install --save @akashaproject/sdk-auth
```

## `Usage`

```
const registerAuthModule = require('@akashaproject/sdk-auth');
```

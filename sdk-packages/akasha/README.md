# @akashaproject/sdk

## `Description`
This package exposes an [api](./src/api/index.ts) which utilizes other packages

 - [auth](./src/api/auth.ts)
 - [common](./src/api/common.ts)
 - [db](./src/api/db.ts)
 - [profiles](./src/api/profiles.ts)
 - [registry](./src/api/registry.ts)

## `Available services`
the [callService](./src/service-caller.ts)

> implemented using [Rxjs](https://rxjs.dev/)

the [Service Worker](./src/sw.ts)

> implementing [Workbox](https://developers.google.com/web/tools/workbox/) configurations

## `Install`
``` shell script
npm install --save @akashaproject/sdk
```

## `Usage`

see sample usage in [feed-app](../../examples/ui/feed-app/src/index.ts)

``` typescript
const sdk = await System.import('@akashaproject/sdk');
  const world = sdk.init({
    config: appConfig,
    initialApps: { plugins: registeredPlugins, widgets: registeredWidgets },
  });
```

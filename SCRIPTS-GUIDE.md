# Scripts Guide -  AKASHA Core

Here is a definitive guide for all the scripts found in the [root package file](./package.json) of this project.

## `bootstrap`
> Installs all other dependencies specified in the nested package.json files using [nx](https://nx.dev/). It executes yarn command together with [build:executors](#buildexecutors)

``` shell script
$ yarn bootstrap
```

## `build:staging`
> Similar to [build:all](#buildall), however it runs `yarn` command first to install packages

``` shell script
$ yarn build:staging
```

## `build:all`
> Runs tsc for all packages, builds sdk, packs ui and ui libs, build feed app and extracts translation, in order.

``` shell script
$ yarn build:all
```

## `build:sdk`
> runs tsc for sdk and builds sdk using Nx.

> Pass `--skip-nx-cache` to skip cache

``` shell script
$ yarn build:sdk
```

## `build:example`
> Runs target `build:staging` using Nx, on example app

``` shell script
$ yarn build:example
```

## `build:executors`
> Builds Nx [executors](./tools/executors/README.md), specified in the [nx workspace](./workspace.json).

``` shell script
$ yarn build:executors
```

## `clean`
> Resets Nx workspaces, clears the cache and removes all **node modules** and built folders

``` shell script
$ yarn clean
```

## `install:clean`
> Runs [clean](#clean), [bootstrap](#bootstrap) and [build:all](#build:all) in order

``` shell script
$ yarn install:clean
```

## `compile:sc`
> Compiles smart contracts by running `sc:compile` script on sdk using Nx. You can optionally define how Nx emits outputs tasks logs using `--output-style` flag


``` shell script
$ yarn compile:sc
```

## `deploy:sc`
> Deploys [compiled](#compilesc) smart contracts to Sepolia Test Network by running `sc:deploy:sepolia` script on sdk using Nx

``` shell script
$ yarn deploy:sc
```

## `extract:translations`
> Extracts translations in all packages using Nx

``` shell script
$ yarn extract:translations
```

## `linter:check`
> Executes **eslint** script on `ts` and `tsx` files using the `--fix-dry-run` flag, which automatically fixes the issues without saving the changes to the file system. 

``` shell script
$ yarn linter:check
```

## `linter:fix`
> Executes **eslint** script on `ts` and `tsx` files using the `--fix` flag, which automatically fixes the issues.

> More about Eslint CLI flags [here](https://eslint.org/docs/latest/use/command-line-interface)

``` shell script
$ yarn linter:fix
```

## `pack:design-system-core`
> Builds [design-system-core](./ui/design-system-core/package.json) using Nx

``` shell script
$ yarn pack:design-system-core
```

## `pack:design-system-components`
> Builds [design-system-components](./ui/design-system-components/package.json) using Nx

``` shell script
$ yarn pack:design-system-components
```

## `pack:ui-widgets`
> Runs target `build` using Nx, on the specified [ui widgets](./ui/widgets/README.md)

``` shell script
$ yarn pack:ui-widgets
```

## `pack:ui-libs`
> Runs target `build` using Nx, on [feed app](./ui/lib/feed/README.md)

``` shell script
$ yarn pack:ui-libs
```

## `pack:ui-apps`
> Runs target `build` using Nx, on the specified [apps](./ui/apps/README.md)

``` shell script
$ yarn pack:ui-apps
```


## `pack:app-loader`
> Runs target `build` using Nx, on [app loader](./ui/app-loader/README.md)

``` shell script
$ yarn pack:app-loader
```

## `pack:ui`
> Runs [tsc:ui](#tscui) and respective pack scripts for design system core, design system components, widgets, apps and app loader, in order

``` shell script
$ yarn pack:ui
```

## `pack:only`
> Executes the pack script in package.json file(s) within the specified scope. You need to specify [the name on the package's package.json file - click for sample](./ui/apps/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaorg/app-profile yarn pack:only
```

## `pack-watch`
> Executes the pack:watch script in package.json file(s) within the specified scope. You need to specify [the name on the package's package.json file - click for sample](./ui/apps/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaorg/app-profile yarn pack:watch
```

> You can as well use * to watch all packages, in a single command

``` shell script
$ AWF_PACKAGE=@akashaorg/* yarn pack:watch
```

## `tsc:sdk`
> Runs tsc command on [sdk](./sdk/package.json)

``` shell script
$ yarn tsc:sdk
```

## `tsc:ui`
> Runs tsc command on [ui hooks](./ui/hooks/package.json)

``` shell script
$ yarn tsc:ui
```

## `tsc:all`
> Runs tsc on all packages while skipping cache

``` shell script
$ yarn tsc:all
```

## `start:feed-app`
> Starts the [feed app](./ui/lib/feed/package.json) and makes it available on localhost. 

``` shell script
$ yarn start:feed-app
```

## `build:feed-app`
> Builds the [feed app](./ui/lib/feed/package.json)

``` shell script
$ yarn build:feed-app
```

## `start:storybook`
> Starts the storybook and makes it available on the localhost as well as the local machine's IP

``` shell script
$ yarn start:storybook
```

## `build:storybook`
> Builds the storybook and makes it available on the localhost as well as the local machine's IP

``` shell script
$ yarn build:storybook
```

## `test:apps`
> Executes all test scripts for apps specified in the `--projects` flag 

``` shell script
$ yarn test:apps
```

## `test:design-system-core`
> Executes test script for design system core 

``` shell script
$ yarn test:design-system-core
```

## `test:design-system-components`
> Executes test script for design system components

``` shell script
$ yarn test:design-system-components
```

## `test:hooks`
> Executes test script for hooks 

``` shell script
$ yarn test:hooks
```

## `test:widgets`
> Executes all test scripts for widgets specified in the `--projects` flag 

``` shell script
$ yarn test:widgets
```

## `test:app-loader`
> Executes test script for app loader

``` shell script
$ yarn test:app-loader
```

## `test:all`
> Executes test scripts for design system core, design system components and hooks, in order

``` shell script
$ yarn test:all
```

## `push:integrations`
> Executes node command on [integrations bucket](./build/integrations_bucket_store.js)

``` shell script
$ yarn push:integrations
```

## `sdk:graphql:generate`
> Runs target `graphql:generate` using Nx, on sdk 

``` shell script
$ yarn sdk:graphql:generate
```

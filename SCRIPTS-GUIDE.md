# Scripts Guide -  AKASHA Core

Here is a definitive guide for all the scripts found in the [root package file](./package.json) of the AKASHA Core project.

## `clean`
> removes tsconfig and runs tsc build

``` shell script
$ yarn clean
```

## `clean:all`
> Runs [clean](#clean), and resets [nx](https://nx.dev/) workspace

``` shell script
$ yarn clean:all
```

## `prepare`
> Runs prepare script for all projects specified in nx workspace

``` shell script
$ yarn prepare
```

## `build:libs`
> Builds all projects with tag `type:lib`

``` shell script
$ yarn build:libs
```

## `build:apps`
> Builds all projects with tag `scope:extension`

``` shell script
$ yarn build:apps
```

## `extract:translations`
> Extracts translations in all packages using Nx

``` shell script
$ yarn extract:translations
```

## `build:all`
> Runs [prepare](#prepare) [build:libs](#buildlibs) [build:apps](#buildapps) and [extract:translations](#extracttranslations) scripts in order.

``` shell script
$ yarn build:all
```

## `apps:watch`
> Watches for file changes in projects within the specified scope. You need to specify [the name on the package(s)' package.json file - click for sample](./extensions/apps/antenna/package.json)

``` shell script
$ nx watch --projects=@akashaorg/app-antenna --includeDependentProjects -- nx build
```

## `world:dev`
> Starts the Akasha World app on the localhost as well as the local machine's IP

``` shell script
$ yarn world:dev
```

## `world:deploy`
> Deploys the Akasha World app

``` shell script
$ yarn world:deploy
```

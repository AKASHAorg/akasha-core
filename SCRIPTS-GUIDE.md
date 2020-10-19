# Scripts Guide -  Akasha Web Framework

Here is a definitive guide for all the scripts found in the [root package file](./package.json) of this project.

## `bootstrap`
> Installs all other dependencies specified in the nested package.json files using [lerna](https://github.com/lerna/lerna)

``` shell script
$ npm run bootstrap
```

## `bootstrap:hoist`
> Executes [bootstrap](#bootstrap) script with hoist flag 

> This allows different nested package.json files in this project requiring a specific dependency to have just one version of such dependency installed on the root of the project

``` shell script
$ npm run bootstrap:hoist
```

## `build:all`
> Executes the [bootstrap](#bootstrap) with no-ci flag, tsc (typescript compiler), [build:sdk](#build:sdk), [pack:ui-apps](#pack:ui-apps) and [extract:translations](#extract:translations) scripts in order

> npm-ci is somewhat similar to npm install except that while npm install can be run without a package-lock file, npm ci requires that an up-to-date pacage-lock be present, for consistent builds in automated test environments and CI/D pipelines

 >**Read more:** [npm-ci documentation](https://docs.npmjs.com/cli/ci.html), [npm-ci vs npm-install](https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)

``` shell script
$ npm run build:all
```

## `build:sdk`
> Executes [tsc:sdk](#tsc:sdk) and build scripts with stream flag within the scope of [sdk](./sdk-packages) sub-directory

> stream flag allows the logging of the i/o of the execution process on the cli

``` shell script
$ npm run build:sdk
```

## `clean`
> Removes all **node modules** folders and clears the cache

``` shell script
$ npm run clean
```

## `compile:sc`
> Executes the sc:compile script to compile the smart contracts in [sdk-packages registry](./sdk-packages/registry) directory

``` shell script
$ npm run compile:sc
```

## `docs`
> Executes all **docs** scripts within scope of [sdk](./sdk-packages) and [sdk-common](./sdk-packages/common) sub-directories

``` shell script
$ npm run docs
```

## `deploy:sc`
> Executes the sc:deploy script to deploy the [compiled](#compile:sc) smart contracts on the test network -  Rinkeby

``` shell script
$ npm run deploy:sc
```

## `extract:translations`
> Executes the extract:translations on all package.json files using the stream flag

``` shell script
$ npm run extract:translations
```

## `install:clean`
> Removes all **node modules** folders, clears the cache and re-installs the node modules by running [clean](#clean) and [build:all](#build:all) in order

``` shell script
$ npm run install:clean
```

## `linter:check`
> Executes **tslint** script with project flag set to [root tsconfig file](./tsconfig.json)

``` shell script
$ npm run linter:check
```

## `linter:fix`
> Executes [linter:check](#linter:check) script with fix flag

``` shell script
$ npm run linter:fix
```

## `pack:ui-apps`
> Executes the pack script in all nested package.json files using the stream flag and within the scope of [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run pack:ui-apps
```

## `pack:only`
> Executes the pack script in package.json file(s) within the specified scope using the stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run pack:only
```

## `pack-watch`
> Executes the pack:watch script in package.json file(s) within the specified scope using the stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

> This is similar to the command above except that this time the watch flag is used to enable hot re-building of file changes using nodemon

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run pack:watch
```

> You can as well use * to watch all packages, in a single command

``` shell script
$ AWF_PACKAGE=@akashaproject/* npm run pack:watch
```

## `script:dev-db`
> Executes the start script within the scope of [script server db](./scripts/server-db/package.json) using the stream flag

``` shell script
$ npm run script:dev-db
```

## `start:feed-app`
> Starts the feed app and makes it available only on localhost. To expose the app on the local machine's IP, use [start:expose-feed-app](#start:expose-feed-app) instead

``` shell script
$ npm run start:feed-app
```

## `start:expose-feed-app`
> Starts and exposes the feed app to localhost as well as the local machine's IP,

``` shell script
$ npm run start:expose-feed-app
```

## `start:translations-server`
> Executes the start script in the [script translations server](./scripts/translations-server)

``` shell script
$ npm run start:translations-server
```

## `start:design-system:storybook`
> Starts the storybook and makes it available on the localhost as well as the local machine's IP

``` shell script
$ npm run start:design-system:storybook
```

## `start:only`
> Executes the start script within the specified scope and using the stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run start:only
```

## `start:api`
> Spins up the api using docker

``` shell script
$ npm run start:api
```

## `stop:api`
> Stops the api running on docker

``` shell script
$ npm run stop:api
```

## `test:sdk`
> Executes all test scripts within the scope of [sdk](./sdk-packages) sub-directory

``` shell script
$ npm run test:sdk
```

## `test:ui`
> Executes all test scripts within the scope of [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run test:ui
```

## `test:ui:watch`
> Executes [test:ui](#test:ui) script using jest watch flag 

``` shell script
$ npm run test:ui:watch
```

## `tsc:sdk`
> Executes tsc and compiles the files within the scope of [sdk](./sdk-packages) sub-directory

``` shell script
$ npm run tsc:sdk
```

## `tsc:ui`
> Executes tsc and compiles the files within the scope of [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run tsc:ui
```

## `tsc:scripts`
> Executes tsc and compiles the files within the scope of [scripts](./scripts) sub-directory

``` shell script
$ npm run tsc:scripts
```

## `watch-plugins`
> Executes the tsc script in all package.json files within the scope of [ui-widget](./ui/widgets) and [ui-plugin](./ui/plugins) using the parallel and -w flags

``` shell script
$ npm run watch-plugins
```
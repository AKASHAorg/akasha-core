# Scripts Guide -  Akasha Web Framework

Here is a definitive guide for all the scripts found in the [root package file](./package.json) of this project.

## <span style="color:green">bootstrap</span>
Installs all other dependencies specified in the nested package.json files using [lerna](https://github.com/lerna/lerna)

``` shell script
$ npm run bootstrap
```

## <span style="color:green">bootstrap:hoist</span>
Executes [bootstrap](#bootstrap) script with hoist flag 

This allows different nested package.json files in this project requiring a specific dependency to have just one version of such dependency installed on the root of the project

``` shell script
$ npm run bootstrap:hoist
```

## <span style="color:green">build:all</span>
Executes the [bootstrap](#bootstrap) with no-ci flag, tsc (typescript compiler), [build:sdk](#build:sdk), [pack:ui-apps](#pack:ui-apps) and [extract:translations](#extract:translations) scripts in order

npm-ci is somewhat similar to npm install except that while npm install can be run without a package-lock file, npm ci requires that an up-to-date pacage-lock be present, for consistent builds in automated test environments and CI/D pipelines

**Read more:** [npm-ci documentation](https://docs.npmjs.com/cli/ci.html), [npm-ci vs npm-install](https://stackoverflow.com/questions/52499617/what-is-the-difference-between-npm-install-and-npm-ci)

``` shell script
$ npm run build:all
```

## <span style="color:green">build:sdk</span>
Executes [tsc:sdk](#tsc:sdk) and build scripts with stream flag within the scope of [sdk](./sdk-packages) sub-directory

stream flag allows the logging of the i/o of the execution process on the cli

``` shell script
$ npm run build:sdk
```

## <span style="color:green">clean</span>
Removes all **node modules** folders and clears the cache

``` shell script
$ npm run clean
```

## <span style="color:green">compile:sc</span>
Executes the sc:compile script to compile the smart contracts in [sdk-packages registry](./sdk-packages/registry) directory

``` shell script
$ npm run compile:sc
```

## <span style="color:green">docs</span>
Executes all **docs** scripts within scope of [sdk](./sdk-packages) and [sdk-common](./sdk-packages/common) sub-directories

``` shell script
$ npm run docs
```

## <span style="color:green">deploy:sc</span>
Executes the sc:deploy script to deploy the [compiled](#compile:sc) smart contracts on the test network -  Rinkeby

``` shell script
$ npm run deploy:sc
```

## <span style="color:green">extract:translations</span>
Executes the extract:translations on all package.json files using the stream flag

``` shell script
$ npm run extract:translations
```

## <span style="color:green">install:clean</span>
Removes all **node modules** folders, clears the cache and re-installs the node modules by running [clean](#clean) and [build:all](#build:all) in order

``` shell script
$ npm run install:clean
```

## <span style="color:green">linter:check</span>
Executes **tslint** script with project flag set to [root tsconfig file](./tsconfig.json)

``` shell script
$ npm run linter:check
```

## <span style="color:green">linter:fix</span>
Executes [linter:check](#linter:check) script with fix flag

``` shell script
$ npm run linter:fix
```

## <span style="color:green">pack:ui-apps</span>
Executes the pack script in all nested package.json files using the stream flag and within the scope of [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run pack:ui-apps
```

## <span style="color:green">pack:only</span>
Executes the pack script in package.json file(s) within the specified scope using the stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run pack:only
```

## <span style="color:green">pack-watch</span>
Executes the pack:watch script in package.json file(s) within the specified scope using the stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

This is similar to the command above except that this time the watch flag is used to enable hot re-building of file changes using nodemon

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run pack:watch
```

You can as well use * to watch all packages, in a single command

``` shell script
$ AWF_PACKAGE=@akashaproject/* npm run pack:watch
```

## <span style="color:green">script:dev-db</span>
Executes the start script within the scope of [script server db](./scripts/server-db/package.json) using the stream flag

``` shell script
$ npm run script:dev-db
```

## <span style="color:green">start:feed-app</span>
Starts the feed app and makes it available only on localhost. To expose the app on the local machine's IP, use [start:expose-feed-app](#start:expose-feed-app) instead

``` shell script
$ npm run start:feed-app
```

## <span style="color:green">start:expose-feed-app</span>
Starts and exposes the feed app to localhost as well as the local machine's IP,

``` shell script
$ npm run start:expose-feed-app
```

## <span style="color:green">start:translations-server</span>
Executes the start script in the [script translations server](./scripts/translations-server)

``` shell script
$ npm run start:translations-server
```

## <span style="color:green">start:design-system:storybook</span>
Starts the storybook and makes it available on the localhost as well as the local machine's IP

``` shell script
$ npm run start:design-system:storybook
```

## <span style="color:green">start:only</span>
Executes the start script within the specified scope and using the stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run start:only
```

## <span style="color:green">start:api</span>
Spins up the api using docker

``` shell script
$ npm run start:api
```

## <span style="color:green">stop:api</span>
Stops the api running on docker

``` shell script
$ npm run stop:api
```

## <span style="color:green">test:sdk</span>
Executes all test scripts within the scope of [sdk](./sdk-packages) sub-directory

``` shell script
$ npm run test:sdk
```

## <span style="color:green">test:ui</span>
Executes all test scripts within the scope of [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run test:ui
```

## <span style="color:green">test:ui:watch</span>
Executes [test:ui](#test:ui) script using jest watch flag 

``` shell script
$ npm run test:ui:watch
```

## <span style="color:green">tsc:sdk</span>
Executes tsc and compiles the files within the scope of [sdk](./sdk-packages) sub-directory

``` shell script
$ npm run tsc:sdk
```

## <span style="color:green">tsc:ui</span>
Executes tsc and compiles the files within the scope of [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run tsc:ui
```

## <span style="color:green">tsc:scripts</span>
Executes tsc and compiles the files within the scope of [scripts](./scripts) sub-directory

``` shell script
$ npm run tsc:scripts
```

## <span style="color:green">watch-plugins</span>
Executes the tsc script in all package.json files within the scope of [ui-widget](./ui/widgets) and [ui-plugin](./ui/plugins) using the parallel and -w flags

``` shell script
$ npm run watch-plugins
```
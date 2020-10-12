# Scripts Guide -  Akasha Web Framework

Here is a definitive guide for all the scripts found in the [root package file](./package.json) of this project.

## <span style="color:green">bootstrap</span>
Installs all other dependencies using lerna

``` shell script
$ npm run bootstrap
```

## <span style="color:green">bootstrap:hoist</span>
Runs [bootstrap](#bootstrap) script with hoist flag

``` shell script
$ npm run bootstrap:hoist
```

## <span style="color:green">build:all</span>
Runs the [bootstrap](#bootstrap), tsc, [build:sdk](#build:sdk), [pack:ui-apps](#pack:ui-apps) and [extract:translations](#extract:translations) in order, with the no-ci flag

``` shell script
$ npm run build:all
```

## <span style="color:green">build:sdk</span>
Runs tsc and build with stream flag and scope set to [sdk](./sdk-packages) sub-directory.

``` shell script
$ npm run build:sdk
```

## <span style="color:green">clean</span>
Removes all **node modules** and clears the cache

``` shell script
$ npm run clean
```

## <span style="color:green">compile:sc</span>

``` shell script
$ npm run compile:sc
```

## <span style="color:green">docs</span>
Runs **docs** with scope set to [sdk](./sdk-packages) and [sdk-common](./sdk-packages/common) sub-directories

``` shell script
$ npm run docs
```

## <span style="color:green">deploy:sc</span>

``` shell script
$ npm run deploy:sc
```

## <span style="color:green">extract:translations</span>

``` shell script
$ npm run extract:translations
```

## <span style="color:green">install:clean</span>
Removes all **node modules**, clears the cache and re-installs the node modules

``` shell script
$ npm run install:clean
```

## <span style="color:green">linter:check</span>
Runs **tslint** with project flag set to [root tsconfig file](./tsconfig.json)

``` shell script
$ npm run linter:check
```

## <span style="color:green">linter:fix</span>
Runs [linter:check](#linter:check) with fix flag

``` shell script
$ npm run linter:fix
```

## <span style="color:green">pack:ui-apps</span>
Packs files within [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run pack:ui
```

## <span style="color:green">pack:only</span>
Packs files using scope and stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run pack:only
```

## <span style="color:green">pack-watch</span>
Packs files and watches for changes using nodemon, scope and stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

``` shell script
$ AWF_PACKAGE=@akashaproject/ui-plugin-profile npm run pack:watch
```

You can as well use * to watch all packages, in a single command

``` shell script
$ AWF_PACKAGE=@akashaproject/* npm run pack:watch
```

## <span style="color:green">tsc:sdk</span>
Compiles the files in the [sdk](./sdk-packages) sub-directory

``` shell script
$ npm run tsc:sdk
```

## <span style="color:green">tsc:ui</span>
Compiles the files in the [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run tsc:ui
```

## <span style="color:green">tsc:scripts</span>
Compiles the files in the [scripts](./scripts) sub-directory

``` shell script
$ npm run tsc:scripts
```

## <span style="color:green">script:dev-db</span>

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

``` shell script
$ npm run start:translations-server
```

## <span style="color:green">start:design-system:storybook</span>
Starts the storybook and makes it available on the localhost as well as the local machine's IP

``` shell script
$ npm run start:design-system:storybook
```

## <span style="color:green">start:only</span>
Starts a package using scope and stream flags. You need to specify [the name on the package's package.json file - click for sample](./ui/plugins/profile/package.json)  using AWF_PACKAGE variable passed to the scope flag

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
Runs all test files on [sdk](./sdk-packages) sub-directory

``` shell script
$ npm run test:sdk
```

## <span style="color:green">test:ui</span>
Runs all test files in [ui](./ui), [design](./ui/design) and [apps](./apps) sub-directories

``` shell script
$ npm run test:ui
```

## <span style="color:green">test:ui:watch</span>
Runs [test:ui](#test:ui) using jest watch flag 

``` shell script
$ npm run test:ui:watch
```

## <span style="color:green">watch-plugins</span>

``` shell script
$ npm run watch-plugins
```